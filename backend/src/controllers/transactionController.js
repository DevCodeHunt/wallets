import transactionService from "../services/transaction.service.js"
import walletService from "../services/wallet.service.js"
import asyncHandler from "../utils/asyncHandler.js"
import {exportCSV} from "../utils/commonHelpers.js"
import {transactionCsvHeaders} from "../utils/enums.js"
import mongoose from "mongoose"

// export const createTransaction = asyncHandler(async (req, res) => {
//   const {walletId} = req.params
//   const wallet = await walletService.getWallet(walletId)
//   if (!wallet) return res.status(404).json({message: "Wallet not found"})
//   const amount = parseFloat(req.body.amount)
//   if (isNaN(amount) || !/^\d+(\.\d{1,4})?$/.test(Math.abs(amount)) || amount == 0) {
//     return res.status(400).json({message: "Please enter a valid amount with up to 4 digits after the decimal."})
//   }
//   if (amount < 0 && wallet.balance < Math.abs(amount)) {
//     return res.status(400).json({message: "Insufficient balance"})
//   }
//   try {
//     const updatedWallet = await walletService.updateWalletBalance(walletId, amount)
//     const transaction = await transactionService.createTransaction({
//       ...req.body,
//       type: amount > 0 ? "CREDIT" : "DEBIT",
//       walletId,
//       amount: Math.abs(amount),
//       balance: updatedWallet.balance,
//     })
//     res.json(transaction)
//   } catch (error) {
//     console.error("Error creating transaction:", transactionError)
//     // Rollback wallet balance
//     const currentWallet = await walletService.getWallet(walletId)
//     if (currentWallet.balance === updatedWallet.balance) {
//       await walletService.updateWalletBalance(walletId, -amount)
//     }
//     res.status(500).json({message: "Transaction failed"})
//   }
// })

export const getTransactions = asyncHandler(async (req, res) => {
  const {walletId, isExport} = req.query
  const wallet = await walletService.getWallet(walletId)
  if (!wallet) return res.status(404).json({message: "Wallet not found"})
  const transactions = await transactionService.getTransactions(req.query)
  if (isExport === "true") {
    return exportCSV(res, transactionCsvHeaders, transactions, "transactions.csv")
  }
  res.json(transactions)
})

/*
 */
//implementation of transactions to
export const createTransaction = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction() // Start the transaction

  try {
    const {walletId} = req.params
    const wallet = await walletService.getWallet(walletId)
    if (!wallet) {
      throw new Error("Wallet not found")
    }

    const amount = parseFloat(req.body.amount)
    // Validate amount (no need to use Math.abs in regex check)
    if (isNaN(amount) || !/^\d+(\.\d{1,4})?$/.test(Math.abs(amount)) || amount == 0) {
      return res.status(400).json({message: "Please enter a valid amount with up to 4 digits after the decimal."})
    }

    // Check for sufficient balance
    console.log(amount, wallet)
    if (amount < 0 && wallet.balance < Math.abs(amount)) {
      throw new Error("Insufficient balance")
    }

    // Update wallet balance
    wallet.balance += amount
    await wallet.save({session})

    // Create the transaction
    await transactionService.createTransaction(
      {
        ...req.body,
        type: amount > 0 ? "CREDIT" : "DEBIT",
        walletId,
        amount: Math.abs(amount), // Ensure absolute value for transaction amount
        balance: wallet.balance, // Updated balance after the transaction
      },
      session
    )

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    // Send the transaction response
    res.json(transaction)
  } catch (error) {
    // Abort transaction in case of error
    await session.abortTransaction()
    session.endSession()

    // Return the error message to the client
    res.status(400).json({message: error.message})
  }
})
//*/

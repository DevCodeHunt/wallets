import transactionService from "../services/transaction.service.js"
import walletService from "../services/wallet.service.js"
import asyncHandler from "../utils/asyncHandler.js"
import {exportCSV} from "../utils/commonHelpers.js"
import {transactionCsvHeaders} from "../utils/enums.js"
import {withTransaction} from "../utils/transactionHelper.js"

/**
 * Creates a transaction for a wallet and updates the wallet balance accordingly.
 * Validates the wallet, amount, and balance before proceeding.
 * Rolls back the wallet balance if the transaction fails.
 *
 * @function createTransaction
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.walletId - The ID of the wallet to be updated.
 * @param {Object} req.body - The request body.
 * @param {number} req.body.amount - The transaction amount (positive for credit, negative for debit).
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the transaction data or an error message.
 *
 * @throws {Error} Returns HTTP 404 if the wallet is not found.
 * @throws {Error} Returns HTTP 400 for invalid amounts or insufficient balance.
 * @throws {Error} Returns HTTP 500 if the transaction fails after validation.
 */

export const createTransaction = asyncHandler(async (req, res) => {
  const {walletId} = req.params
  const wallet = await walletService.getWallet(walletId)
  if (!wallet) return res.status(404).json({message: "Wallet not found"})
  const amount = parseFloat(req.body.amount)
  if (isNaN(amount) || !/^\d+(\.\d{1,4})?$/.test(Math.abs(amount)) || amount == 0) {
    return res.status(400).json({message: "Please enter a valid amount with up to 4 digits after the decimal."})
  }
  if (amount < 0 && wallet.balance < Math.abs(amount)) {
    return res.status(400).json({message: "Insufficient balance"})
  }
  try {
    const updatedWallet = await walletService.updateWalletBalance(walletId, amount)
    const transaction = await transactionService.createTransaction({
      ...req.body,
      type: amount > 0 ? "CREDIT" : "DEBIT",
      walletId,
      amount: Math.abs(amount),
      balance: updatedWallet.balance,
    })
    res.json(transaction)
  } catch (error) {
    console.error("Error creating transaction:", transactionError)
    // Rollback wallet balance
    const currentWallet = await walletService.getWallet(walletId)
    if (currentWallet.balance === updatedWallet.balance) {
      await walletService.updateWalletBalance(walletId, -amount)
    }
    res.status(500).json({message: "Transaction failed"})
  }
})

/**
 * Retrieves transactions for a specified wallet and optionally exports them as a CSV file.
 *
 * @function getTransactions
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters.
 * @param {string} req.query.walletId - The ID of the wallet for which to fetch transactions.
 * @param {string} [req.query.isExport] - Flag indicating whether to export transactions as a CSV file ("true" to export).
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the transactions or exports a CSV file.
 *
 * @throws {Error} Returns HTTP 404 if the wallet is not found.
 * @throws {Error} Returns HTTP 500 for any other server error during retrieval or export.
 */

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
Optimised way using MongoDB transactions to avoid race conditions, automatic rollback and to keep data consistent,
please uncomment the createTransaction funtion in transaction service to support the session.

/**
 * Creates a transaction for a wallet and updates the wallet balance within a MongoDB transaction.
 * Validates the wallet, amount, and balance before proceeding.
 *
 * @function createTransaction
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.walletId - The ID of the wallet to be updated.
 * @param {Object} req.body - The request body.
 * @param {number} req.body.amount - The transaction amount (positive for credit, negative for debit).
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the transaction data or an error message.
 * 
 * @throws {Error} Returns HTTP 400 if the amount is invalid or insufficient balance.
 * @throws {Error} Returns HTTP 404 if the wallet is not found.
 * @throws {Error} Returns HTTP 500 for any server-side errors during transaction creation.

export const createTransaction = asyncHandler(async (req, res) => {
  try {
    const result = await withTransaction(async (session) => {
      const {walletId} = req.params
      const wallet = await walletService.getWallet(walletId)

      if (!wallet) {
        throw new Error("Wallet not found")
      }

      const amount = parseFloat(req.body.amount)
      if (isNaN(amount) || !/^\d+(\.\d{1,4})?$/.test(Math.abs(amount)) || amount === 0) {
        return res.status(400).json({
          message: "Please enter a valid amount with up to 4 digits after the decimal.",
        })
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
      const transaction = await transactionService.createTransaction(
        {
          ...req.body,
          type: amount > 0 ? "CREDIT" : "DEBIT",
          walletId,
          amount: Math.abs(amount), // Ensure absolute value for transaction amount
          balance: wallet.balance, // Updated balance after the transaction
        },
        session
      )

      return transaction[0]
    })

    // Send the transaction response
    res.json(result)
  } catch (error) {
    console.log(error.stack)
    res.status(500).json({message: error.message})
  }
})

*/

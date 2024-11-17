import transactionService from "../services/transaction.service.js"
import walletService from "../services/wallet.service.js"
import asyncHandler from "../utils/asyncHandler.js"
import {Parser} from "json2csv"

export const createTransaction = asyncHandler(async (req, res) => {
  const {walletId} = req.params
  const wallet = await walletService.getWallet(walletId)
  if (!wallet) return res.status(404).json({message: "Wallet not found"})
  const amount = parseFloat(req.body.amount)
  if (isNaN(amount) || !/^\d+(\.\d{1,4})?$/.test(Math.abs(amount)) || amount == 0) {
    return res.status(400).json({message: "Amount must be a valid number with up to 4 digits after the decimal."})
  }
  if (amount < 0 && wallet.balance < Math.abs(amount)) {
    return res.status(400).json({message: "Insufficient balance"})
  }
  wallet.balance += amount
  await wallet.save()
  const transaction = await transactionService.createTransaction({
    ...req.body,
    type: amount > 0 ? "CREDIT" : "DEBIT",
    walletId,
    amount: parseFloat(amount),
    balance: wallet.balance,
  })
  res.json(transaction)
})

export const getTransactions = asyncHandler(async (req, res) => {
  const {walletId, isExport} = req.query
  const wallet = await walletService.getWallet(walletId)
  if (!wallet) return res.status(404).json({message: "Wallet not found"})
  const transactions = await transactionService.getTransactions(req.query)
  if (isExport === "true") {
    const fields = ["_id", "amount", "wallet", "createdAt"]
    const json2csvParser = new Parser({fields})
    const csv = json2csvParser.parse(transactions)
    res.header("Content-Type", "text/csv")
    res.attachment("transactions.csv")
    return res.send(csv)
  }
  res.json(transactions)
})

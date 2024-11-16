import transactionService from "../services/transaction.service.js";
import walletService from "../services/wallet.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createTransaction = asyncHandler(async (req, res) => {
  const { walletId } = req.params;
  const wallet = await walletService.getWallet(walletId);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });
  const amount = parseFloat(req.body.amount);
  const { transactionType } = req.body;

  if (transactionType === "debit") {
    if (wallet.balance <= 0) {
      return res
        .status(400)
        .json({ message: "Cannot deduct from a zero balance" });
    }
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    await wallet.save();
  } else {
    wallet.balance += amount;
    await wallet.save();
  }

  const transaction = await transactionService.createTransaction({
    ...req.body,
    wallet: walletId,
    amount: parseFloat(amount),
  });
  res.json(transaction);
});

export const getTransactions = asyncHandler(async (req, res) => {
  const { walletId } = req.query;
  const wallet = await walletService.getWallet(walletId);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });
  const transactions = await transactionService.getTransactions(req.query);
  res.json(transactions);
});

import walletService from "../services/wallet.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.createWallet(req.body);
  res.status(201).json(wallet);
});

export const getWallets = asyncHandler(async (req, res) => {
  const wallets = await walletService.getWallets();
  res.json(wallets);
});

export const getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.params.id);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });
  res.json(wallet);
});

export const updateWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.updateWallet(req.params.id, req.body);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });
  res.json(wallet);
});

export const deleteWallet = asyncHandler(async (req, res) => {
  const deleted = await walletService.deleteWallet(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Wallet not found" });
  res.status(204).json({});
});

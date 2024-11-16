import walletService from "../services/wallet.service.js"
import asyncHandler from "../utils/asyncHandler.js"

export const createWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.createWallet(req.body)
  res.status(201).json(wallet)
})

export const getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.params.id)
  if (!wallet) return res.status(404).json({message: "Wallet not found"})
  res.json(wallet)
})

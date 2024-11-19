import walletService from "../services/wallet.service.js"
import asyncHandler from "../utils/asyncHandler.js"

/**
 * Creates a new wallet using the provided request body.
 *
 * @function createWallet
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing wallet details.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the created wallet data.
 *
 * @throws {Error} Returns HTTP 500 for any server-side errors during wallet creation.
 */

export const createWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.createWallet(req.body)
  res.status(201).json(wallet)
})

/**
 * Retrieves a wallet by its ID.
 *
 * @function getWallet
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the wallet to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends a JSON response with the wallet data or an error message.
 *
 * @throws {Error} Returns HTTP 404 if the wallet is not found.
 * @throws {Error} Returns HTTP 500 for any server-side errors during wallet retrieval.
 */

export const getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.params.id)
  if (!wallet) return res.status(404).json({message: "Wallet not found"})
  res.json(wallet)
})

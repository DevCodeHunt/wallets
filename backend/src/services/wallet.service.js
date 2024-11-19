import Wallet from "../models/Wallet.js"

class WalletService {
  async createWallet(data) {
    return await Wallet.create(data)
  }

  async getWallet(id) {
    return await Wallet.findById(id)
  }

  async updateWalletBalance(walletId, amount) {
    const updatedWallet = await Wallet.findOneAndUpdate({_id: walletId}, {$inc: {balance: amount}}, {new: true})
    if (!updatedWallet) {
      throw new Error("Failed to update wallet balance")
    }
    return updatedWallet
  }
  async updateWalletBalance(walletId, amount) {
    const precisionFactor = 10000
    const wallet = await Wallet.findById(walletId)
    if (!wallet) {
      throw new Error("Wallet not found")
    }
    const newBalance = Math.round((wallet.balance + amount) * precisionFactor) / precisionFactor
    const updatedWallet = await Wallet.findOneAndUpdate({_id: walletId}, {$set: {balance: newBalance}}, {new: true})

    if (!updatedWallet) {
      throw new Error("Failed to update wallet balance")
    }
    return updatedWallet
  }
}

const walletService = new WalletService()

export default walletService

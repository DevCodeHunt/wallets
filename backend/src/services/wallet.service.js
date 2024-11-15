import Wallet from "../models/Wallet.js";

class WalletService {
  async getWallets() {
    return await Wallet.find().sort({ createdAt: -1 });
  }
  async createWallet(data) {
    return await Wallet.create(data);
  }

  async getWallet(id) {}

  async updateWallet(id, data) {}

  async deleteWallet(id) {}
}

const walletService = new WalletService();

export default walletService;

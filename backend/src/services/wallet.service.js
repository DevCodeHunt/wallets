import Wallet from "../models/Wallet.js";

class WalletService {
  async createWallet(data) {
    return await Wallet.create(data);
  }

  async getWallet(id) {
    return await Wallet.findById(id);
  }
}

const walletService = new WalletService();

export default walletService;

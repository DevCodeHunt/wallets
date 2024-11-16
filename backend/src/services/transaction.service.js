import Transaction from "../models/Transaction.js";
import crypto from "crypto";
class TransactionService {
  async createTransaction(data) {
    const schema = {
      ...data,
      transactionId: crypto.randomInt(1000000000, 9999999999).toString(),
    };

    return await Transaction.create(schema);
  }

  async getTransactions(query) {
    const { walletId } = query
    const skip = parseInt(query.skip) || 0;
    const limit = parseInt(query.limit) || 10;
    return await Transaction.find({ wallet: walletId }).sort({ createdAt: -1 });
  }

  async getTransaction(transactionId, walletId) {
    return await Transaction.findOne({ wallet: walletId, transactionId });
  }
}

const transactionService = new TransactionService();

export default transactionService;

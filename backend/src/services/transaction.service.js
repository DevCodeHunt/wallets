import Transaction from "../models/Transaction.js"
import crypto from "crypto"
class TransactionService {
  async createTransaction(data) {
    const schema = {
      ...data,
      transactionId: crypto.randomInt(1000000000, 9999999999).toString(),
    }
    return await Transaction.create(schema)
  }

  async getTransactions(query) {
    const {walletId, isExport} = query
    if (isExport === "true") {
      const transactions = await Transaction.find({walletId})
      return transactions
    } else {
      const skip = parseInt(query.skip) || 0
      const limit = parseInt(query.limit) || 5
      const [transactions, total] = await Promise.all([Transaction.find({walletId}).skip(skip).limit(limit).sort({createdAt: -1}), Transaction.countDocuments({walletId})])
      return {
        transactions,
        total,
      }
    }
  }

  async getTransaction(transactionId, walletId) {
    return await Transaction.findOne({wallet: walletId, transactionId})
  }
}

const transactionService = new TransactionService()

export default transactionService

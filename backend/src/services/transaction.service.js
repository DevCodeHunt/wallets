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
    let {walletId, isExport, skip, limit, sortField, sortDirection} = query
    console.log(walletId, isExport, skip, limit, sortField, sortDirection)
    let sortBy = {}
    if (sortField) {
      sortBy[sortField] = parseInt(sortDirection)
    }
    if (isExport === "true") {
      const transactions = await Transaction.find({walletId}, {_id: 0, walletId: 0, __v: 0}).sort(sortBy).lean()
      return transactions
    } else {
      skip = parseInt(skip) || 0
      limit = parseInt(limit) || 10
      const [transactions, total] = await Promise.all([Transaction.find({walletId}).skip(skip).limit(limit).sort(sortBy), Transaction.countDocuments({walletId})])
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

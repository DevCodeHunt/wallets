import Transaction from "../models/Transaction.js"
class TransactionService {
  async createTransaction(transaction) {
    return await Transaction.create(transaction)
  }

  async getTransactions(query) {
    let {walletId, isExport, skip, limit, sortField, sortDirection} = query
    let sortBy = {date: -1}
    if (sortField) {
      sortBy = {[sortField]: parseInt(sortDirection)}
    }
    if (isExport === "true") {
      const transactions = await Transaction.find({walletId}, {_id: 0, walletId: 0, __v: 0}).sort({date: 1}).lean()
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

  /*
  uncomment the code while using the mongodb transactions

  async createTransaction(transaction, session) {
    return await Transaction.create([transaction], {session})
  }
  */
}

const transactionService = new TransactionService()

export default transactionService

import apiClient from "../api/apiClient"

export const createTransaction = async (walletId, data) => {
  const transaction = await apiClient.post(`/transact/${walletId}`, data)
  return transaction.data
}

export const getTransactions = async (query) => {
  let url = `/transactions?walletId=${query.walletId}&limit=${query.limit || 10}&skip=${query.skip || 0}`
  if (query.isExport) {
    url += `&isExport=${query.isExport}`
    const transactions = await apiClient.get(url, {
      responseType: "blob",
    })
    return transactions.data
  }
  if (query.sortField) {
    url += `&sortField=${query.sortField}&sortDirection=${query.sortDirection}`
  }
  const transactions = await apiClient.get(url)
  return transactions.data
}

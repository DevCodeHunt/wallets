import apiClient from "../api/apiClient"

export const createTransaction = async (walletId, data) => {
  const transaction = await apiClient.post(`/transact/${walletId}`, data)
  return transaction.data
}

export const getTransactions = async (query) => {
  let url = `/transactions?walletId=${query.walletId}`
  if (query.limit) url += `&limit=${query.limit}`
  if (query.skip) url += `&skip=${query.skip}`
  if (query.isExport) {
    url += `&isExport=${query.isExport}`
    const transactions = await apiClient.get(url, {
      responseType: "blob",
    })
    return transactions.data
  }
  const transactions = await apiClient.get(url)
  return transactions.data
}

import apiClient from "../api/apiClient";

export const createTransaction = async (walletId, data) => {
  const transaction = await apiClient.post(`/transaction/${walletId}`, data);
  return transaction.data;
};

export const getTransactions = async (query) => {
  let url = `/transactions?walletId=${query.walletId}`;
  if (query.limit) {
    url += `&limit=${query.limit}`;
  }
  if (query.skip) {
    url += `&sortBy=${query.skip}`;
  }
  const transactions = await apiClient.get(url);
  return transactions.data;
};

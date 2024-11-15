import apiClient from "../api/apiClient";

export const createWallet = async (data) => {
  const wallet = await apiClient.post("/setup", data);
  return wallet.data;
};

export const getWallets = async () => {
  const wallets = await apiClient.get("/wallets");
  return wallets.data;
};

export const getWallet = async (id) => {
  const wallet = await apiClient.get(`/wallets/${id}`);
  return wallet.data;
};

export const updateWallet = async (id, data) => {
  const wallet = await apiClient.put(`/wallets/${id}`, data);
  return wallet.data;
};

export const deleteWallet = async (id) => {
  await apiClient.delete(`/wallets/${id}`);
};

export const getTransactions = async (id) => {
  const transactions = await apiClient.get(`/wallets/${id}/transactions`);
  return transactions.data;
};

export const createTransaction = async (id, data) => {
  const transaction = await apiClient.post(`/wallets/${id}/transactions`, data);
  return transaction.data;
};

export const getTransaction = async (id) => {
  const transaction = await apiClient.get(`/transactions/${id}`);
  return transaction.data;
};



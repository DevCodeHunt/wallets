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
  const wallet = await apiClient.get(`/wallet/${id}`);
  return wallet.data;
};

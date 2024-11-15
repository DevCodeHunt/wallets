import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

const useWallets = () => {
  return useContext(WalletContext);
};

export default useWallets;

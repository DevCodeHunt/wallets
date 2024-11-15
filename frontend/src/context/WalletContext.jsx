import { createContext, useEffect, useState } from "react";
import { getWallets } from "../services/walletService";

// eslint-disable-next-line react-refresh/only-export-components
export const WalletContext = createContext({});

export const WalletContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [error, setError] = useState(null);
  const [activeWalletId, setActiveWalletId] = useState(
    localStorage.getItem("activeWalletId")
  );

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await getWallets();
        setWallets(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <WalletContext.Provider
      value={{
        isLoading,
        wallets,
        error,
        setWallets,
        activeWalletId,
        setActiveWalletId,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

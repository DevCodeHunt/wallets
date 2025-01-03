import {createContext, useEffect, useState} from "react"
import {getWallet} from "../services/walletService"
// eslint-disable-next-line react-refresh/only-export-components
export const WalletContext = createContext({})

export const WalletContextProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeWalletId, setActiveWalletId] = useState(localStorage.getItem("activeWalletId"))

  const [wallet, setWallet] = useState(null)
  useEffect(() => {
    const loadWalletData = async () => {
      setIsLoading(true)
      try {
        const data = await getWallet(localStorage.getItem("activeWalletId") || null)
        setWallet(data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadWalletData()
  }, [activeWalletId])

  return (
    <WalletContext.Provider
      value={{
        isLoading,
        error,
        activeWalletId,
        setActiveWalletId,
        wallet,
        setWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

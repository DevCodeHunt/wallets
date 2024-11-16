import Wallet from "../../components/Wallet/Wallet"
import WalletForm from "../../components/WalletForm/WalletForm"
import useWallets from "../../hooks/useWallets"
import styles from "./Home.module.css"
import CreateWalletModal from "../../components/Modals/CreateWalletModal"
import {useCallback, useState} from "react"
import WalletTransactionModal from "../../components/Modals/WalletTransactionModal"

const Home = () => {
  const [openCreateWalletModal, setOpenCreateWalletModal] = useState(false)
  const [openWalletTransactionModal, setOpenWalletTransactionModal] = useState(false)
  const {isLoading, wallet: activeWallet} = useWallets()

  const handleOpenstartTransactionModal = useCallback(() => {
    setOpenWalletTransactionModal((prev) => !prev)
  }, [])

  return (
    <>
      {openCreateWalletModal && <CreateWalletModal setOpen={setOpenCreateWalletModal} />}
      {openWalletTransactionModal && <WalletTransactionModal setOpen={setOpenWalletTransactionModal} />}
      <div className={`container ${styles.walletContainer}`}>{isLoading ? <div>Loading...</div> : activeWallet?.id ? <Wallet wallet={activeWallet} handleOpenstartTransactionModal={handleOpenstartTransactionModal} /> : <WalletForm />}</div>
    </>
  )
}

export default Home

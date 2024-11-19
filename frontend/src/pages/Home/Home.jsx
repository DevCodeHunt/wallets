import Wallet from "../../components/Wallet/Wallet"
import WalletForm from "../../components/WalletForm/WalletForm"
import useWallets from "../../hooks/useWallets"
import styles from "./Home.module.css"
import {useCallback, useState} from "react"
import WalletTransactionModal from "../../components/Modals/WalletTransactionModal"
import Overlay from "../../components/Overlay/Overlay"

const Home = () => {
  const [openWalletTransactionModal, setOpenWalletTransactionModal] = useState(false)
  const {isLoading, wallet: activeWallet} = useWallets()

  const handleOpenstartTransactionModal = useCallback(() => {
    setOpenWalletTransactionModal((prev) => !prev)
  }, [])

  return (
    <>
      {openWalletTransactionModal && <WalletTransactionModal setOpen={setOpenWalletTransactionModal} />}
      <div className={`container ${styles.walletContainer}`}>{isLoading ? <Overlay /> : activeWallet?.id ? <Wallet wallet={activeWallet} handleOpenstartTransactionModal={handleOpenstartTransactionModal} /> : <WalletForm />}</div>
    </>
  )
}

export default Home

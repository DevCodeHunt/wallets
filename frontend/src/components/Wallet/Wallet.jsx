import styles from "./Wallet.module.css"
import {Wallet as WalletIcon} from "lucide-react"
import dayjs from "dayjs"
import {useNavigate} from "react-router-dom"

const Wallet = ({wallet, handleOpenstartTransactionModal}) => {
  const navigate = useNavigate("")

  const handleViewTransaction = () => {
    navigate("/wallet-transaction", {state: {walletId: wallet.id}})
  }

  const formatBalance = (balance) => (Number.isInteger(balance) ? balance : parseFloat(balance.toFixed(4)))

  return (
    <div className={styles.walletContainer}>
      <div className={styles.wallet}>
        <div className={styles.walletHeader}>
          <WalletIcon className={styles.walletIcon} />
          <h4>{wallet?.name}</h4>
        </div>
        <div className={styles.walletBody}>
          <p className={styles.balance}>₹ {formatBalance(wallet?.balance || 0)}</p>
          <p className={styles.date}>{dayjs(wallet?.date).format("DD MMM, YYYY")}</p>
        </div>
        <div className={styles.walletActions}>
          <button type="button" onClick={handleOpenstartTransactionModal} className={styles.primaryButton}>
            Start Transaction
          </button>
          <button type="button" onClick={handleViewTransaction} className={styles.secondaryButton}>
            View Transactions
          </button>
        </div>
      </div>
    </div>
  )
}

export default Wallet

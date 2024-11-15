import styles from "./Wallet.module.css";
import { Wallet as WalletIcon } from "lucide-react";
import dayjs from "dayjs";
import useWallets from "../../hooks/useWallets";

const Wallet = ({ wallet }) => {
  const { setActiveWalletId } = useWallets();

  const handleWalletClick = () => {
    setActiveWalletId(wallet?.id);
    localStorage.setItem("activeWalletId", wallet?.id);
  };
  return (
    <div className={styles.wallet} onClick={handleWalletClick}>
      <div className={styles.walletHeader}>
        <WalletIcon className={styles.walletIcon} />
        <h4>{wallet?.name}</h4>
      </div>
      <div className={styles.walletBody}>
        <p className={styles.balance}>${wallet?.balance}</p>
        <p className={styles.date}>
          {dayjs(wallet?.date).format("DD MMM, YYYY")}
        </p>
      </div>
    </div>
  );
};

export default Wallet;

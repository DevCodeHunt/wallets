import { ArrowUpFromLine, Plus } from "lucide-react";
import Wallet from "../../components/Wallet/Wallet";
import WalletForm from "../../components/WalletForm/WalletForm";
import useWallets from "../../hooks/useWallets";
import styles from "./Home.module.css";
import CreateWalletModal from "../../components/Modals/CreateWalletModal";
import { useCallback, useState } from "react";
import WalletTransactionModal from "../../components/Modals/WalletTransactionModal";

const Home = () => {
  const [openCreateWalletModal, setOpenCreateWalletModal] = useState(false);
  const [openWalletTransactionModal, setOpenWalletTransactionModal] =
    useState(false);
  const { wallets, isLoading, wallet: activeWallet } = useWallets();
 

  const handleOpenCreateWalletModal = useCallback(
    () => setOpenCreateWalletModal((prev) => !prev),
    []
  );

  const handleOpenstartTransactionModal = useCallback(() => {
    setOpenWalletTransactionModal((prev) => !prev);
  }, []);
console.log(activeWallet);

  // const activeWallet = wallets?.find((wallet) => wallet?.id === activeWalletId);

  return (
    <>
      {openCreateWalletModal && (
        <CreateWalletModal setOpen={setOpenCreateWalletModal} />
      )}
      {openWalletTransactionModal && (
        <WalletTransactionModal setOpen={setOpenWalletTransactionModal} />
      )}
      <div className={`container ${styles.walletContainer}`}>
        {isLoading ? (
          <div>Loading...</div>
        ) : wallets?.length > 0 ? (
          <>
            <div className={styles.currentWallet}>
              <div className={styles.currentWalletHeader}>
                <h2>{activeWallet?.name}</h2>
                <div className={styles.currentWalletHeaderAction}>
                  <button
                    type="button"
                    onClick={handleOpenstartTransactionModal}
                    className="primary"
                  >
                    <ArrowUpFromLine size={18} /> Start Transaction
                  </button>
                </div>
              </div>
              <p className={styles.currentWalletBalance}>
                ${activeWallet?.balance}
              </p>
            </div>
            <div className={styles.createWallerBtn}>
              <button
                className="primary"
                type="button"
                onClick={handleOpenCreateWalletModal}
              >
                {" "}
                <Plus size={18} />
                Create Wallet
              </button>
            </div>
            <div className={styles.wallets}>
              {wallets.map((wallet, index) => (
                <Wallet key={index} wallet={wallet} />
              ))}
            </div>
          </>
        ) : (
          <WalletForm />
        )}
      </div>
    </>
  );
};

export default Home;

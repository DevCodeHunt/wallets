import { useLocation } from "react-router-dom";
import styles from "./WalletTransaction.module.css";
import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";
import useWallets from "../../hooks/useWallets";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WalletTransaction = () => {
  const {
    state: { walletId },
  } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { wallet } = useWallets();
  const [transactions, setTransactions] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await getTransactions({ walletId, skip, limit });
        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [walletId, limit, skip]);

  const handlePageChange = (type) => {
    switch (type) {
      case "prev":
        setSkip((prev) => prev - 1);
        break;
      case "next":
        setSkip((prev) => prev + 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`container ${styles.transactionContainer}`}>
      <h2>{wallet?.name}</h2>
      <p>Wallet ID: {walletId}</p>
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className={styles.transactionList}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction, index) => (
                <tr key={index} className={styles.transactionItem}>
                  <td>{transaction._id}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {transaction.transactionType}
                  </td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.description}</td>
                  <td>{dayjs(transaction.date).format("DD-MM-YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.pagination}>
        <button
          type="button"
          onClick={() => handlePageChange("prev")}
          className={styles.prevBtn}
        >
          <ChevronLeft size={20} />
        </button>
        {Array.from({ length: 6 }, (_, idx) => (
          <button
            key={idx + 1}
            className={`${styles.page} ${skip === idx ? styles.active : ""}  `}
          >
            {idx + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handlePageChange("next")}
          className={styles.nextBtn}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default WalletTransaction;

import {useLocation, useNavigate} from "react-router-dom"
import styles from "./WalletTransactions.module.css"
import {useEffect, useState} from "react"
import {getTransactions} from "../../services/transactionService"
import dayjs from "dayjs"
import {ChevronLeft, ChevronRight, Download} from "lucide-react"

const WalletTransaction = () => {
  const navigate = useNavigate()
  const {
    state: {walletId},
  } = useLocation()
  let [page, setPage] = useState(1)
  let [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  //const {wallet} = useWallets()
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        let [limit, skip] = [5, (page - 1) * 5]
        const data = await getTransactions({walletId, skip, limit})
        if (data.total) {
          setTransactions(data.transactions)
          setTotalPages(Math.ceil(data.total / limit))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [walletId, page])

  const handlePageChange = (selectedPage) => {
    if (selectedPage !== page && selectedPage > 0 && selectedPage <= totalPages) setPage(selectedPage)
  }

  const downloadCSV = async () => {
    try {
      let response = await getTransactions({walletId, isExport: true})
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "transactions.csv")
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error("Error exporting transactions:", error)
    }
  }

  return (
    <div className={`container ${styles.transactionContainer}`}>
      <div className={styles.navStyles}>
        <button
          type="button"
          onClick={() => {
            navigate("/")
          }}
          className="primary"
        >
          Back{" "}
        </button>
        <h2>Transaction Details</h2>
        <span>
          <Download className={styles.downloadIcon} onClick={downloadCSV} />
        </span>
      </div>
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : (
        <>
          <div className={styles.transactionList}>
            {transactions.length > 0 ? (
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
                      <td style={{textTransform: "capitalize"}}>{transaction.transactionType}</td>
                      <td>₹ {transaction.amount}</td>
                      <td>{transaction.description}</td>
                      <td>{dayjs(transaction.date).format("DD-MM-YYYY")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.transactionNotFound}>
                <p>No transactions found for the wallet!!</p>
              </div>
            )}
          </div>
        </>
      )}
      {totalPages > 0 && (
        <div className={styles.pagination}>
          <div className="pagination"></div>
          {page == 1 ? null : (
            <button type="button" onClick={() => handlePageChange(page - 1)} className={styles.prevBtn}>
              <ChevronLeft size={20} />
            </button>
          )}
          {totalPages &&
            [...Array(totalPages)].map((_, i) => (
              <button onClick={() => handlePageChange(i + 1)} key={i + 1} className={`${styles.page} ${page - 1 === i ? styles.active : ""}  `}>
                {i + 1}
              </button>
            ))}
          {page == totalPages ? null : (
            <button type="button" onClick={() => handlePageChange(page + 1)} className={styles.nextBtn}>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default WalletTransaction

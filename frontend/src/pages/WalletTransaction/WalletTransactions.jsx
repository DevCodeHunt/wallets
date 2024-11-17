import {useLocation, useNavigate} from "react-router-dom"
import styles from "./WalletTransactions.module.css"
import {useEffect, useState} from "react"
import {getTransactions} from "../../services/transactionService"
import dayjs from "dayjs"
import {ChevronLeft, ChevronRight, Download, ArrowDownAZ, ArrowUpAZ, ArrowDownUp} from "lucide-react"
import Overlay from "../../components/Overlay/Overlay"

const WalletTransaction = () => {
  const navigate = useNavigate()
  const {
    state: {walletId},
  } = useLocation()
  let [page, setPage] = useState(1)
  let [sort, setSort] = useState({field: null, direction: 1})
  let [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        let [limit, skip] = [10, (page - 1) * 10]
        const data = await getTransactions({walletId, skip, limit, sortField: sort.field, sortDirection: sort.direction})
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
  }, [walletId, page, sort])

  const handlePageChange = (selectedPage) => {
    if (selectedPage !== page && selectedPage > 0 && selectedPage <= totalPages) setPage(selectedPage)
  }

  const downloadCSV = async () => {
    try {
      setIsLoading(true)
      let response = await getTransactions({walletId, isExport: true})
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "transactions.csv")
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error("Error exporting transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field) => {
    setSort((prevSort) => ({
      field,
      direction: prevSort.field === field && prevSort.direction === 1 ? -1 : 1,
    }))
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
        <div style={{width: "50px"}}>{transactions.length > 0 ? <Download className={styles.downloadIcon} onClick={downloadCSV} /> : " "}</div>
      </div>

      <div className={styles.transactionList}>
        {transactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Transaction Type</th>
                <th onClick={() => handleSort("amount")} style={{cursor: "pointer", width: "160px"}} title="Click to sort by Amount">
                  <div style={{display: "flex", alignItems: "center"}}>
                    Amount
                    {sort.field === "amount" ? sort.direction === 1 ? <ArrowDownAZ className={styles.sortIcon} /> : <ArrowUpAZ className={styles.sortIcon} /> : <ArrowDownUp className={styles.sortIcon} />}
                  </div>
                </th>
                <th>Description</th>
                <th onClick={() => handleSort("date")} style={{cursor: "pointer"}} title="Click to sort by Transaction Date">
                  <div style={{display: "flex", alignItems: "center"}}>
                    Transaction Date
                    {sort.field === "date" ? sort.direction === 1 ? <ArrowDownAZ className={styles.sortIcon} /> : <ArrowUpAZ className={styles.sortIcon} /> : <ArrowDownUp className={styles.sortIcon} />}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction._id}</td>
                  <td style={{textTransform: "capitalize"}}>{transaction.type}</td>
                  <td>₹ {transaction.amount}</td>
                  <td>{transaction.description}</td>
                  <td>{dayjs(transaction.date).format("DD-MM-YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.transactionNotFound}>
            <p> No transactions found for the wallet......!!</p>
          </div>
        )}
        {isLoading ? <Overlay /> : null}
      </div>
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

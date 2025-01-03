import express from "express"
import {createTransaction, getTransactions} from "../controllers/transactionController.js"

const router = express.Router()

router.get("/transactions", getTransactions)
router.post("/transact/:walletId", createTransaction)

export default router

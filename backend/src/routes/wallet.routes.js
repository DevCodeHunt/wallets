import express from "express"
import {createWallet, getWallet} from "../controllers/walletController.js"

const router = express.Router()

router.get("/wallet/:id", getWallet)
router.post("/setup", createWallet)

export default router

import express from "express";
import { createWallet, getWallets } from "../controllers/walletController.js";

const router = express.Router();

router.get("/wallets", getWallets)
router.post("/setup", createWallet)

export default router;
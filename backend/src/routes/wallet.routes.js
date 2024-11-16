import express from "express";
import {
  createWallet,
  getWallet,
  getWallets,
} from "../controllers/walletController.js";

const router = express.Router();

router.get("/wallets", getWallets);
router.get("/wallet/:id", getWallet);
router.post("/setup", createWallet);

export default router;

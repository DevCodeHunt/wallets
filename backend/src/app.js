import express from "express";
import cors from "cors";
import errorHandlerMiddleware from "./middlewares/errorMiddleware.js";
import walletRoutes from "./routes/wallet.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    message: "Welcome to the Wallet API",
  });
});

app.use("/", walletRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: "Page not found",
  });
});

app.use(errorHandlerMiddleware);

export default app;

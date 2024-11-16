import styles from "./Modal.module.css";
import { HandCoins, Shield, X } from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input/Input";
import useWallets from "../../hooks/useWallets";
import { createTransaction } from "../../services/transactionService";

const walletSchema = Yup.object().shape({
  amount: Yup.string()
    .required("Transaction amount is required")
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Invalid amount"),
  transactionType: Yup.boolean().optional(),
  description: Yup.string().required("Description of transaction is required"),
});

const initialValues = {
  amount: "",
  transactionType: false,
  description: "",
};

const WalletTransactionModal = ({ setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { setWallets, wallet, setWallet } = useWallets();
  const navigate = useNavigate();
  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues,
    validationSchema: walletSchema,
    onSubmit: async (values, { resetForm }) => {
      // Submit form data to API or save to state
      setLoading(true);
      try {
        const transactionType = values.transactionType ? "credit" : "debit";
        const responseBody = {
          ...values,
          transactionType,
        };
        await createTransaction(wallet?.id, responseBody);
        if (transactionType === "debit") {
          const updatedBalance = wallet.balance - parseFloat(amount); // Calculate new balance immutably
          const updatedWallet = { ...wallet, balance: updatedBalance }; // Create updated wallet

          setWallet(updatedWallet);
          setWallets((prevWallets) =>
            prevWallets.map((w) => (w.id === wallet.id ? updatedWallet : w))
          );
        } else {
          const updatedBalance = wallet.balance + parseFloat(amount); // Calculate new balance immutably
          const updatedWallet = { ...wallet, balance: updatedBalance }; // Create updated wallet

          setWallet(updatedWallet);
          setWallets((prevWallets) =>
            prevWallets.map((w) => (w.id === wallet.id ? updatedWallet : w))
          );
        }
        if (transactionType === "debit") {
          toast.success(
            `Transaction successful! Your wallet balance has been reduced by ${values.amount}`
          );
        } else {
          toast.success(
            `Transaction successful! Your wallet balance has been increased by ${values.amount}`
          );
        }

        resetForm();
        navigate("/wallet-transaction", { state: { walletId: wallet.id } });
        setOpen(false);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const { amount, transactionType, description } = values;
  return (
    <div className="modal">
      <div className="modalCard">
        <div className={styles.modalHeader}>
          <h2>My {wallet?.name} Wallet</h2>
          <button type="button" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <p>Your current wallet balance is ${wallet?.balance}</p>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <Input
            id="amount"
            name="amount"
            label="Transaction amount"
            icon={HandCoins}
            placeholder="eg. 20, 74.45,"
            value={amount}
            onChange={handleChange}
            error={errors?.amount}
          />
          <Input
            id="description"
            label="Transaction description"
            icon={Shield}
            name="description"
            placeholder="Recharge"
            value={description}
            onChange={handleChange}
            error={errors?.description}
          />
          <div className={styles.walletTypeToggle}>
            <span>Debit</span>
            <label htmlFor="transactionType" className={styles.walletType}>
              <input
                id="transactionType"
                name="transactionType"
                type="checkbox"
                value={transactionType}
                onChange={handleChange}
              />
              <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
            <span>Credit</span>
          </div>
          <button type="submit" disabled={loading} className="primary">
            {loading ? "Loading..." : "Start Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletTransactionModal;

import styles from "./CreateWalletModal.module.css";
import { HandCoins,  X } from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useState } from "react";
import { createWallet } from "../../services/walletService";
import Input from "../Input/Input";
import useWallets from "../../hooks/useWallets";

const walletSchema = Yup.object().shape({
  balance: Yup.string()
    .required("Required")
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Invalid balance"),
});

const initialValues = {
  balance: "",
};

const WalletTransactionModal = ({ setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { setWallets } = useWallets();
  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues,
    validationSchema: walletSchema,
    onSubmit: async (values, { resetForm }) => {
      // Submit form data to API or save to state
      setLoading(true);
      try {
        const data = await createWallet(values);
        setWallets((prevWallets) => [data, ...prevWallets]);
        toast.success(`Wallet created successfully`);
        resetForm();
        setOpen(false);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const { balance } = values;
  return (
    <div className="modal">
      <div className="modalCard">
        <div className={styles.modalHeader}>
          <h2>Create Wallet</h2>
          <button type="button" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <Input
            id="balance"
            label="Wallet balance"
            icon={HandCoins}
            placeholder="eg. 20, 74.45,"
            value={balance}
            onChange={handleChange}
            error={errors?.balance}
          />
          <button type="submit" disabled={loading} className="primary">
            {loading ? "Loading..." : "Start Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletTransactionModal;

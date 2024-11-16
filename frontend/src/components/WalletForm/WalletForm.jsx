import Input from "../Input/Input";
import styles from "./WalletForm.module.css";
import { HandCoins, Wallet } from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useState } from "react";
import { createWallet } from "../../services/walletService";
import useWallets from "../../hooks/useWallets";

const walletSchema = Yup.object().shape({
  name: Yup.string().required("Wallet name is required"),
  balance: Yup.string()
    .required("Wallet balance is required")
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "Invalid balance"),
});

const initialValues = {
  name: "",
  balance: "",
};
const WalletForm = () => {
  const [loading, setLoading] = useState(false);
  const { setActiveWalletId } = useWallets();
  
  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues,
    validationSchema: walletSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        let wallet = await createWallet(values);
        if(wallet?.id){
          toast.success(`Wallet created successfully`);
          localStorage.setItem("activeWalletId", wallet?.id)
          setActiveWalletId(wallet?.id)
          resetForm();
        }
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const { name, balance } = values;
  return (
    <div className="modalContainer">
      <div className={styles.formContainer}>
        <h2>Create your wallet</h2>
        <form onSubmit={handleSubmit}>
          <Input
            id="name"
            name="name"
            label="Wallet name"
            icon={Wallet}
            placeholder="eg. Hello world"
            value={name}
            onChange={handleChange}
            error={errors?.name}
            />
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
            {loading ? "Creating wallet..." : "Create wallet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletForm;

import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";
import WalletTransaction from "./pages/WalletTransaction/WalletTransactions";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="wallet-transaction" element={<WalletTransaction />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;

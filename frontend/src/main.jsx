import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { WalletContextProvider } from "./context/WalletContext.jsx";

createRoot(document.getElementById("root")).render(
  <WalletContextProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </WalletContextProvider>
);

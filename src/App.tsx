import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { CartProvider } from "@/hooks/useCart";
import CartDrawer from "@/components/feature/CartDrawer";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <CartProvider>
          <AppRoutes />
          <CartDrawer />
        </CartProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;

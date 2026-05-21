import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { CartProvider, useCart } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { WishlistProvider } from "@/hooks/useWishlist";
import CartDrawer from "@/components/feature/CartDrawer";
import ChatBot from "@/components/feature/ChatBot";

function AppInner() {
  const { isOpen } = useCart();
  const { pathname } = useLocation();
  const hideChatBot = pathname.startsWith("/products") || pathname.startsWith("/configurator");
  return (
    <>
      <AppRoutes />
      <CartDrawer />
      {!isOpen && !hideChatBot && <ChatBot />}
    </>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AuthProvider>
          <CurrencyProvider>
            <WishlistProvider>
              <CartProvider>
                <AppInner />
              </CartProvider>
            </WishlistProvider>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;

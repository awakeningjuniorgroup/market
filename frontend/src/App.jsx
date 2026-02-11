import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/products/ProductDetails";
import Checkout from "./components/cart/checkout"; // ✅ majuscule cohérente
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminHomePage from "./components/admin/AdminHomePage";
import UserManagement from "./components/admin/UserManagement";
import ProductManagement from "./components/admin/ProductManagement";
import EditProductPage from "./components/admin/EditProductPage";
import OrderManagement from "./components/admin/OrderManagement";
import ProtectRoute from "./components/common/ProtectRoute";
import Invoice from "./components/cart/Invoice";
import WhatsAppButton from "./components/common/whatsAppButton";//✅ cohérence
import ScrollToTop from "./components/common/ScrollToTop";

import { Provider} from "react-redux";
import store from "../redux/store"; 


const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collections/:collection" element={<CollectionPage />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="invoice/:id" element={<Invoice />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectRoute role="admin">
                <AdminLayout />
              </ProtectRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
        <WhatsAppButton /> {/* ✅ bouton toujours visible */}
      </BrowserRouter>
    </Provider>
  );
};

export default App;

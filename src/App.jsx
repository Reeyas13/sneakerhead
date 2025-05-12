import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import OrderDetailsPage from './pages/OrderDetailsPage';

// Account Pages
import AccountPage from './pages/account/AccountPage';
import ProfilePage from './pages/account/ProfilePage';
import OrdersPage from './pages/account/OrdersPage';
import PasswordPage from './pages/account/PasswordPage';
import AddressesPage from './pages/account/AddressesPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <Routes>
                {/* Main Layout Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="product/:id" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="payment/success" element={<PaymentSuccessPage />} />
                  <Route path="payment/failure" element={<PaymentFailurePage />} />
                  <Route path="order/:id" element={<OrderDetailsPage />} />
                  
                  {/* Auth Routes */}
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  
                  {/* Account Routes */}
                  <Route path="account" element={<AccountPage />}>
                    <Route index element={<ProfilePage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="password" element={<PasswordPage />} />
                    <Route path="addresses" element={<AddressesPage />} />
                  </Route>
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

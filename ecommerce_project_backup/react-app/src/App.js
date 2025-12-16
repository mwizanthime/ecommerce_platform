// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Add this import
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ShippingInfo from './pages/ShippingInfo';
import Returns from './pages/Returns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Wishlist from './pages/customer/Wishlist';
// import UserReviews from './pages/UserReviews';
// import ReviewModeration from './pages/admin/ReviewModeration';
import MyReviews from './pages/MyReviews';
import StandalonePayment from './pages/StandalonePayment';
import TransactionStatus from './pages/TransactionStatus';
import PaymentHistory from './pages/PaymentHistory';
import TransactionHistory from './pages/TransactionHistory';
import OrderPaymentStatus from './pages/OrderPaymentStatus';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider> {/* Add CartProvider here */}
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shipping" element={<ShippingInfo />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                {/* <Route path="/my-reviews" element={<UserReviews />} /> */}
                {/* <Route path="/admin/reviews" element={<ReviewModeration />} /> */}
                <Route path="/my-reviews" element={<MyReviews />} />  
                
                {/* Protected Routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>} />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/send-money" element={
                  <ProtectedRoute>
                    <StandalonePayment />
                  </ProtectedRoute>
                } />
                <Route path="/transactions/:transactionId" element={
                  <ProtectedRoute>
                    <TransactionStatus />
                  </ProtectedRoute>
                } />
                <Route path="/payments/history" element={
                  <ProtectedRoute>
                    <PaymentHistory />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:orderId/payment" element={
                  <ProtectedRoute>
                    <OrderPaymentStatus />
                  </ProtectedRoute>
                } />

              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
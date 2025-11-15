// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};



// Add to your existing productsAPI object
export const productsAPI = {
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getSellerProducts: () => api.get('/products/seller/products'), // Add this
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  updateProduct: (id, data) => {
    console.log('API: Updating product', id, 'with data:', data);
    return api.put(`/products/${id}`, data);
  },
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  adjustStock: (id, data) => api.patch(`/products/${id}/stock`, data),
  bulkAdjustStock: (data) => api.patch('/products/stock/bulk', data)
};

// services/api.js - Add analytics endpoints
export const analyticsAPI = {
  getSellerAnalytics: () => api.get('/analytics/seller'),
  getAdminAnalytics: () => api.get('/analytics/admin')
};


export const couponAPI = {
  getCoupons: () => api.get('/coupons'),
  getCoupon: (id) => api.get(`/coupons/${id}`),
  createCoupon: (data) => api.post('/coupons', data),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  validateCoupon: (code, orderAmount) => 
    api.post('/coupons/validate', { code, orderAmount })
};


export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/items', { productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};




// // Update sellerOrdersAPI with item-level status methods
// export const sellerOrdersAPI = {
//   // Get seller's orders
//   getSellerOrders: () => api.get('/orders/seller/orders'),
  
//   // Update order item status (per product)
//   updateOrderItemStatus: (orderItemId, data) => 
//     api.patch(`/orders/seller/order-items/${orderItemId}/status`, data),
  
//   // Mark order as paid
//   markOrderAsPaid: (orderId) => 
//     api.patch(`/orders/seller/orders/${orderId}/mark-paid`),
// };


// Update sellerOrdersAPI with better error handling
export const sellerOrdersAPI = {
  // Get seller's orders
  getSellerOrders: () => api.get('/orders/seller/orders'),
  
  // Update order item status (per product)
  updateOrderItemStatus: (orderItemId, data) => 
    api.patch(`/orders/seller/order-items/${orderItemId}/status`, data),
  
  // Mark order as paid
  markOrderAsPaid: (orderId) => 
    api.patch(`/orders/seller/orders/${orderId}/mark-paid`),
    
  // Get seller order stats
  getSellerOrderStats: () => api.get('/orders/seller/orders/stats'),
};



// // Also update ordersAPI as fallback
// export const ordersAPI = {
//   getOrders: () => api.get('/orders'),
//   getOrder: (id) => api.get(`/orders/${id}`),
//   cancelOrder: (id, data) => api.patch(`/orders/${id}/cancel`, data),
//   getOrderTracking: (id) => api.get(`/orders/${id}/tracking`),
//   createOrder: (data) => api.post('/orders', data),
  
//   // Seller orders methods
//   getSellerOrders: () => api.get('/orders/seller/orders'),
//   updateOrderItemStatus: (orderItemId, data) => 
//     api.patch(`/orders/seller/order-items/${orderItemId}/status`, data),
//   markOrderAsPaid: (orderId) => 
//     api.patch(`/orders/seller/orders/${orderId}/mark-paid`),
// };






// Remove duplicate methods from ordersAPI to avoid confusion
export const ordersAPI = {
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, data) => api.patch(`/orders/${id}/cancel`, data),
  getOrderTracking: (id) => api.get(`/orders/${id}/tracking`),
  createOrder: (data) => api.post('/orders', data),
  // Add purchase verification
  checkProductPurchase: (productId) => api.get(`/orders/check-purchase/${productId}`),
};

// export const reviewsAPI = {
//   getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
//   getUserReview: (productId) => api.get(`/reviews/product/${productId}/user`),
//   createReview: (data) => api.post('/reviews', data),
//   updateReview: (id, data) => api.put(`/reviews/${id}`, data),
//   deleteReview: (id) => api.delete(`/reviews/${id}`),
// };

// export const reviewsAPI = {
//   getProductReviews: (productId, params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return api.get(`/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`);
//   },
//   getUserReview: (productId) => api.get(`/reviews/product/${productId}/user`),
//   // Add the missing getUserReviews method
//   getUserReviews: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return api.get(`/reviews/user${queryString ? `?${queryString}` : ''}`);
//   },
//   createReview: (data) => api.post('/reviews', data),
//   updateReview: (id, data) => api.put(`/reviews/${id}`, data),
//   deleteReview: (id) => api.delete(`/reviews/${id}`),
// };





export const reviewsAPI = {
  // Get reviews for a specific product
  getProductReviews: (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get user's review for a specific product
  getUserReview: (productId) => api.get(`/reviews/product/${productId}/user`),
  
  // Get all reviews by the current user
  getUserReviews: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/reviews/user${queryString ? `?${queryString}` : ''}`);
  },
  
  // Create a new review
  createReview: (data) => api.post('/reviews', data),
  
  // Update a review
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  
  // Delete a review
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  
  // Moderation endpoints
  getPendingReviews: () => api.get('/reviews/pending'),
  getAdminPendingReviews: () => api.get('/reviews/admin/pending'),
  moderateReview: (reviewId, data) => api.patch(`/reviews/${reviewId}/moderate`, data),
  moderateAdminReview: (reviewId, data) => api.patch(`/reviews/admin/${reviewId}/moderate`, data),
  getAdminReviewStats: () => api.get('/reviews/admin/statistics'),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
};





export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  approveSeller: (id) => api.put(`/users/${id}/approve`),
  
  // Profile picture endpoints
  uploadProfilePicture: (formData) => 
    api.patch('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
  
  removeProfilePicture: () => api.delete('/users/profile/picture'),
};


export const dashboardAPI = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getSellerDashboard: () => api.get('/dashboard/seller'),
  getCustomerDashboard: () => api.get('/dashboard/customer'),
};



export const deliveryAPI = {
  getTrackingInfo: (orderId) => api.get(`/delivery/orders/${orderId}/tracking`),
  getDeliveryProofs: (orderId) => api.get(`/delivery/orders/${orderId}/proofs`),
  verifyDeliveryWithOTP: (orderId, data) => api.post(`/delivery/orders/${orderId}/verify-otp`, data),
  uploadDeliveryProof: (orderId, formData) => api.post(`/delivery/orders/${orderId}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  initiateDelivery: (orderId, data) => api.post(`/delivery/orders/${orderId}/ship`, data),
  updateDeliveryStatus: (trackingId, data) => api.patch(`/delivery/tracking/${trackingId}/status`, data),
  recordDeliveryAttempt: (trackingId, data) => api.post(`/delivery/tracking/${trackingId}/attempt`, data)
};

export default api;
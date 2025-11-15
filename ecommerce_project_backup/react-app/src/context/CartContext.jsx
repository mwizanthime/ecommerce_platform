// // src/context/CartContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { cartAPI } from '../services/api';
// import { useAuth } from './AuthContext';

// const CartContext = createContext();

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user) {
//       fetchCart();
//     } else {
//       setCartItems([]);
//     }
//   }, [user]);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const response = await cartAPI.getCart();
//       setCartItems(response.data.items || []);
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (productId, quantity = 1) => {
//     try {
//       await cartAPI.addToCart(productId, quantity);
//       await fetchCart(); // Refresh cart
//     } catch (error) {
//       throw error;
//     }
//   };

//   const updateCartItem = async (itemId, quantity) => {
//     try {
//       await cartAPI.updateCartItem(itemId, quantity);
//       await fetchCart();
//     } catch (error) {
//       throw error;
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     try {
//       await cartAPI.removeFromCart(itemId);
//       await fetchCart();
//     } catch (error) {
//       throw error;
//     }
//   };

//   const clearCart = async () => {
//     try {
//       await cartAPI.clearCart();
//       setCartItems([]);
//     } catch (error) {
//       throw error;
//     }
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const getCartItemsCount = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getCartItemCount = () => {
//   return cartItems.reduce((total, item) => total + item.quantity, 0);
// };

//   const value = {
//     cartItems,
//     addToCart,
//     updateCartItem,
//     removeFromCart,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     getCartItemCount,
//     loading
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };


// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching cart for user:', user.id);
      const response = await cartAPI.getCart();
      console.log('Cart API response:', response.data);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    try {
      await cartAPI.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartAPI.updateCartItem(itemId, quantity);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId);
      await fetchCart(); // Refresh cart
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
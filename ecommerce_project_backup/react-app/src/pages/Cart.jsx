// // src/pages/Cart.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';

// const Cart = () => {
//   const { cartItems, updateCartItem, removeFromCart, getCartTotal, loading } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!user) {
//     navigate('/login');
//     return null;
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-2xl mx-auto text-center">
//           <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
//           <Link
//             to="/products"
//             className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="border-b border-gray-200 last:border-b-0">
//                   <div className="p-6 flex items-center space-x-4">
//                     <img
//                       src={item.product_image || '/api/placeholder/100/100'}
//                       alt={item.product_name}
//                       className="w-20 h-20 object-cover rounded-lg"
//                     />
                    
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-800 mb-1">{item.product_name}</h3>
//                       <p className="text-gray-600">${item.price}</p>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
//                         className="p-1 rounded-full hover:bg-gray-100"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </button>
                      
//                       <span className="w-12 text-center">{item.quantity}</span>
                      
//                       <button
//                         onClick={() => updateCartItem(item.id, item.quantity + 1)}
//                         className="p-1 rounded-full hover:bg-gray-100"
//                       >
//                         <Plus className="w-4 h-4" />
//                       </button>
//                     </div>
                    
//                     <div className="text-right">
//                       <p className="font-semibold text-gray-800">
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </p>
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="text-red-500 hover:text-red-700 mt-1"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span>${getCartTotal().toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping</span>
//                   <span className="text-green-600">Free</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Tax</span>
//                   <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
//                 </div>
//                 <div className="border-t border-gray-200 pt-3">
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total</span>
//                     <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={() => navigate('/checkout')}
//                 className="w-full bg-primary-500 text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//               >
//                 Proceed to Checkout
//               </button>

//               <Link
//                 to="/products"
//                 className="block text-center w-full bg-primary-500 text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 hover:text-gray-700 transition-colors font-semibold mt-4"
//               >
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;



// src/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart, getCartTotal, loading, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debug: Log cart items to see what's being received
  React.useEffect(() => {
    console.log('Cart items:', cartItems);
  }, [cartItems]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link
            to="/products"
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        {/* Debug info - remove in production */}
        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-semibold">Debug Info</h3>
          <p className="text-blue-700">
            Cart Items: {cartItems.length} | 
            First item image: {cartItems[0]?.product_image || 'No image'}
          </p>
          <button 
            onClick={refreshCart}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Refresh Cart Data
          </button>
        </div> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                  <div className="p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.src = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/100/100`;
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 truncate">{item.product_name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                      {item.stock_quantity < item.quantity && (
                        <p className="text-red-500 text-sm mt-1">
                          Only {item.stock_quantity} left in stock
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 rounded-full hover:bg-gray-100 border border-gray-300"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        className="p-2 rounded-full hover:bg-gray-100 border border-gray-300"
                        disabled={item.quantity >= item.stock_quantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right min-w-20">
                      <p className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2 flex items-center justify-center w-full"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary-600 text-gray-700 border border-gray-300  py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center w-full bg-primary-500 text-gray-700 hover:text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
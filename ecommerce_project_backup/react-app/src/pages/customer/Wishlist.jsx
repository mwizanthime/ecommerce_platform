// // src/pages/customer/Wishlist.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
// import { wishlistAPI, cartAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const Wishlist = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [removing, setRemoving] = useState(null);
//   const [addingToCart, setAddingToCart] = useState(null);

//   useEffect(() => {
//     fetchWishlist();
//   }, []);

//   const fetchWishlist = async () => {
//     try {
//       setLoading(true);
//       const response = await wishlistAPI.getWishlist();
//       setWishlist(response.data.wishlist || []);
//     } catch (error) {
//       console.error('Error fetching wishlist:', error);
//       toast.error('Failed to load wishlist');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFromWishlist = async (productId) => {
//     try {
//       setRemoving(productId);
//       await wishlistAPI.removeFromWishlist(productId);
//       toast.success('Product removed from wishlist');
//       setWishlist(wishlist.filter(item => item.product_id !== productId));
//     } catch (error) {
//       console.error('Error removing from wishlist:', error);
//       toast.error('Failed to remove from wishlist');
//     } finally {
//       setRemoving(null);
//     }
//   };

//   const addToCart = async (product) => {
//     try {
//       setAddingToCart(product.product_id);
//       await cartAPI.addToCart(product.product_id, 1);
//       toast.success('Product added to cart');
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       toast.error('Failed to add product to cart');
//     } finally {
//       setAddingToCart(null);
//     }
//   };

//   const moveAllToCart = async () => {
//     try {
//       setAddingToCart('all');
//       for (const item of wishlist) {
//         try {
//           await cartAPI.addToCart(item.product_id, 1);
//         } catch (error) {
//           console.error(`Failed to add product ${item.product_id} to cart:`, error);
//         }
//       }
//       toast.success('All items added to cart');
//     } catch (error) {
//       console.error('Error moving all to cart:', error);
//       toast.error('Failed to add some items to cart');
//     } finally {
//       setAddingToCart(null);
//     }
//   };

//   const clearWishlist = async () => {
//     if (!window.confirm('Are you sure you want to clear your entire wishlist?')) return;

//     try {
//       setLoading(true);
//       // Remove each item one by one
//       for (const item of wishlist) {
//         try {
//           await wishlistAPI.removeFromWishlist(item.product_id);
//         } catch (error) {
//           console.error(`Failed to remove product ${item.product_id}:`, error);
//         }
//       }
//       setWishlist([]);
//       toast.success('Wishlist cleared');
//     } catch (error) {
//       console.error('Error clearing wishlist:', error);
//       toast.error('Failed to clear wishlist');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
//             <p className="text-gray-600 mt-2">
//               {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
//             </p>
//           </div>
          
//           {wishlist.length > 0 && (
//             <div className="flex space-x-3 mt-4 md:mt-0">
//               <button
//                 onClick={moveAllToCart}
//                 disabled={addingToCart === 'all'}
//                 className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
//               >
//                 <ShoppingCart className="w-4 h-4 mr-2" />
//                 {addingToCart === 'all' ? 'Adding...' : 'Add All to Cart'}
//               </button>
//               <button
//                 onClick={clearWishlist}
//                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Clear All
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Wishlist Items */}
//         {wishlist.length > 0 ? (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//               {wishlist.map((item) => (
//                 <div
//                   key={item.id}
//                   className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   {/* Product Image */}
//                   <div className="relative">
//                     <img
//                       src={item.product_image || '/api/placeholder/300/300'}
//                       alt={item.name}
//                       className="w-full h-48 object-cover"
//                       onError={(e) => {
//                         e.target.src = '/api/placeholder/300/300';
//                       }}
//                     />
//                     <button
//                       onClick={() => removeFromWishlist(item.product_id)}
//                       disabled={removing === item.product_id}
//                       className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-red-50 transition-colors disabled:opacity-50"
//                       title="Remove from wishlist"
//                     >
//                       {removing === item.product_id ? (
//                         <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                       ) : (
//                         <Heart className="w-4 h-4 text-red-600 fill-red-600" />
//                       )}
//                     </button>
//                   </div>

//                   {/* Product Info */}
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
//                       {item.name}
//                     </h3>
                    
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-2xl font-bold text-primary-600">
//                         ${item.price}
//                       </span>
//                       {item.quantity > 0 ? (
//                         <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
//                           In Stock
//                         </span>
//                       ) : (
//                         <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
//                           Out of Stock
//                         </span>
//                       )}
//                     </div>

//                     <p className="text-sm text-gray-600 mb-4">
//                       {item.quantity || 0} available
//                     </p>

//                     {/* Actions */}
//                     <div className="flex space-x-2">
//                       <Link
//                         to={`/products/${item.product_id}`}
//                         className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         View
//                       </Link>
//                       <button
//                         onClick={() => addToCart(item)}
//                         disabled={addingToCart === item.product_id || item.quantity === 0}
//                         className="flex-1 bg-primary-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
//                       >
//                         {addingToCart === item.product_id ? (
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         ) : (
//                           <>
//                             <ShoppingCart className="w-4 h-4 mr-1" />
//                             Add to Cart
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           /* Empty Wishlist State */
//           <div className="bg-white rounded-lg shadow-md p-12 text-center">
//             <div className="max-w-md mx-auto">
//               <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">
//                 Your wishlist is empty
//               </h2>
//               <p className="text-gray-600 mb-8">
//                 Start adding products you love to your wishlist. They'll appear here for easy access later.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link
//                   to="/products"
//                   className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
//                 >
//                   Start Shopping
//                 </Link>
//                 <Link
//                   to="/dashboard"
//                   className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                 >
//                   Back to Dashboard
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Recently Viewed Suggestions */}
//         {wishlist.length > 0 && (
//           <div className="mt-12">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">You might also like</h2>
//               <Link
//                 to="/products"
//                 className="text-primary-600 hover:text-primary-700 font-semibold"
//               >
//                 View All Products
//               </Link>
//             </div>
            
//             {/* You can add a carousel or grid of recommended products here */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-center">
//               <p className="text-gray-600 mb-4">
//                 Discover more products that match your interests
//               </p>
//               <Link
//                 to="/products"
//                 className="bg-primary-600 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
//               >
//                 <ShoppingCart className="w-4 h-4 mr-2" />
//                 Explore Products
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Wishlist;




// src/pages/customer/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { wishlistAPI, cartAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Get product image URL - using the same logic as ProductCard
  const getProductImage = (item) => {
    // First try product_image (from wishlist API)
    if (item.product_image && item.product_image !== '/api/placeholder/300/300') {
      console.log('Wishlist - Using product_image:', item.product_image);
      
      if (item.product_image.startsWith('http')) {
        return item.product_image;
      }
      
      if (item.product_image.startsWith('/uploads/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${item.product_image}`;
      }
      
      if (!item.product_image.includes('/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${item.product_image}`;
      }
      
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${item.product_image}`;
    }

    // Then try primary_image (from product data)
    if (item.primary_image && item.primary_image !== '/api/placeholder/300/300') {
      console.log('Wishlist - Using primary_image:', item.primary_image);
      
      if (item.primary_image.startsWith('http')) {
        return item.primary_image;
      }
      
      if (item.primary_image.startsWith('/uploads/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${item.primary_image}`;
      }
      
      if (!item.primary_image.includes('/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${item.primary_image}`;
      }
      
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${item.primary_image}`;
    }

    // Fallback to placeholder
    console.log('Wishlist - No product image available, using placeholder');
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
  };

  const handleImageError = (productId) => {
    console.log('Wishlist - Image failed to load for product:', productId);
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const removeFromWishlist = async (productId) => {
    try {
      setRemoving(productId);
      await wishlistAPI.removeFromWishlist(productId);
      toast.success('Product removed from wishlist');
      setWishlist(wishlist.filter(item => item.product_id !== productId));
      // Remove from image errors state
      setImageErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[productId];
        return newErrors;
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (product) => {
    try {
      setAddingToCart(product.product_id);
      await cartAPI.addToCart(product.product_id, 1);
      toast.success('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const moveAllToCart = async () => {
    try {
      setAddingToCart('all');
      for (const item of wishlist) {
        try {
          await cartAPI.addToCart(item.product_id, 1);
        } catch (error) {
          console.error(`Failed to add product ${item.product_id} to cart:`, error);
        }
      }
      toast.success('All items added to cart');
    } catch (error) {
      console.error('Error moving all to cart:', error);
      toast.error('Failed to add some items to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const clearWishlist = async () => {
    if (!window.confirm('Are you sure you want to clear your entire wishlist?')) return;

    try {
      setLoading(true);
      // Remove each item one by one
      for (const item of wishlist) {
        try {
          await wishlistAPI.removeFromWishlist(item.product_id);
        } catch (error) {
          console.error(`Failed to remove product ${item.product_id}:`, error);
        }
      }
      setWishlist([]);
      setImageErrors({}); // Clear all image errors
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          
          {wishlist.length > 0 && (
            <div className="flex space-x-3 mt-4 md:mt-0">
              <button
                onClick={moveAllToCart}
                disabled={addingToCart === 'all'}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {addingToCart === 'all' ? 'Adding...' : 'Add All to Cart'}
              </button>
              <button
                onClick={clearWishlist}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlist.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {wishlist.map((item) => {
                const productImage = imageErrors[item.product_id] 
                  ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`
                  : getProductImage(item);

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={productImage}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                        onError={() => handleImageError(item.product_id)}
                        onLoad={() => console.log('Wishlist - Image loaded for product:', item.name)}
                      />
                      <button
                        onClick={() => removeFromWishlist(item.product_id)}
                        disabled={removing === item.product_id}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        {removing === item.product_id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                        )}
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-primary-600">
                          ${item.price}
                        </span>
                        {item.quantity > 0 ? (
                          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {item.quantity || 0} available
                      </p>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${item.product_id}`}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={addingToCart === item.product_id || item.quantity === 0}
                          className="flex-1 bg-primary-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                          {addingToCart === item.product_id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty Wishlist State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding products you love to your wishlist. They'll appear here for easy access later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Start Shopping
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed Suggestions */}
        {wishlist.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You might also like</h2>
              <Link
                to="/products"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All Products
              </Link>
            </div>
            
            {/* You can add a carousel or grid of recommended products here */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">
                Discover more products that match your interests
              </p>
              <Link
                to="/products"
                className="bg-primary-600 text-gray-700 border border-gray-300 px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Explore Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
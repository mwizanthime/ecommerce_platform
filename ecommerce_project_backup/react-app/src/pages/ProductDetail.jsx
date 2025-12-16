// // src/pages/ProductDetail.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
// import { productsAPI } from '../services/api';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import ProductCard from '../components/Products/ProductCard';
// import toast from 'react-hot-toast';
// import { wishlistAPI } from '../services/api';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//    const [isInWishlist, setIsInWishlist] = useState(false);
//   const { addToCart } = useCart();
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const response = await productsAPI.getProduct(id);
//       setProduct(response.data);
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       toast.error('Product not found');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleWishlist = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!user) {
//       toast.error('Please login to add items to wishlist');
//       navigate('/login');
//       return;
//     }

//     try {
//       if (isInWishlist) {
//         await wishlistAPI.removeFromWishlist(product.id);
//         setIsInWishlist(false);
//         toast.success('Removed from wishlist!');
//       } else {
//         await wishlistAPI.addToWishlist(product.id);
//         setIsInWishlist(true);
//         toast.success('Added to wishlist!');
//       }
//     } catch (error) {
//       toast.error('Failed to update wishlist');
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       toast.error('Please login to add items to cart');
//       navigate('/login');
//       return;
//     }

//     try {
//       await addToCart(product.id, quantity);
//       toast.success('Product added to cart!');
//     } catch (error) {
//       toast.error('Failed to add product to cart');
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
//           <button
//             onClick={() => navigate('/products')}
//             className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
//           >
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back
//         </button>

//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
//             {/* Product Images */}
//             <div>
//               <div className="mb-4">
//                 <img
//                   src={product.images?.[selectedImage]?.image_url || '/api/placeholder/300/300'}
//                   alt={product.name}
//                   className="w-full h-96 object-cover rounded-lg"
//                 />
//               </div>
//               {product.images && product.images.length > 1 && (
//                 <div className="grid grid-cols-4 gap-2">
//                   {product.images.map((image, index) => (
//                     <button
//                       key={image.id}
//                       onClick={() => setSelectedImage(index)}
//                       className={`border-2 rounded-lg overflow-hidden ${
//                         selectedImage === index ? 'border-primary-500' : 'border-gray-200'
//                       }`}
//                     >
//                       <img
//                         src={image.image_url}
//                         alt={`${product.name} ${index + 1}`}
//                         className="w-full h-20 object-cover"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Product Info */}
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
//               <div className="flex items-center mb-4">
//                 <div className="flex items-center">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`w-5 h-5 ${
//                         star <= Math.round(product.average_rating || 0)
//                           ? 'text-yellow-400 fill-current'
//                           : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-gray-600 ml-2">
//                   ({product.review_count || 0} reviews)
//                 </span>
//               </div>

//               <div className="mb-6">
//                 {product.compare_price && product.compare_price > product.price ? (
//                   <div className="flex items-center space-x-4">
//                     <span className="text-3xl font-bold text-gray-900">${product.price}</span>
//                     <span className="text-xl text-gray-500 line-through">${product.compare_price}</span>
//                     <span className="text-lg text-red-600 font-semibold">
//                       {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
//                     </span>
//                   </div>
//                 ) : (
//                   <span className="text-3xl font-bold text-gray-900">${product.price}</span>
//                 )}
//               </div>

//               <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

//               <div className="mb-6">
//                 <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
//                   product.quantity > 0 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
//                 </span>
//               </div>

//               {product.quantity > 0 && (
//                 <div className="flex items-center space-x-4 mb-6">
//                   <div className="flex items-center border border-gray-300 rounded-lg">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                     >
//                       -
//                     </button>
//                     <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
//                     <button
//                       onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
//                       className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                     >
//                       +
//                     </button>
//                   </div>
                  
//                   <button
//                     onClick={handleAddToCart}
//                     className="flex-1 bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
//                   >
//                     <ShoppingCart className="w-5 h-5" />
//                     <span>Add to Cart</span>
//                   </button>

//                   <button
//                             onClick={handleWishlist}
//                             className={`ml-2 p-2 rounded-full border transition-colors ${
//                               isInWishlist 
//                                 ? 'bg-red-50 border-red-200 text-red-500' 
//                                 : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
//                             }`}
//                             aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
//                           >
//                             <Heart 
//                               className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} 
//                             />
//                           </button>
//                 </div>
//               )}

//               <div className="border-t border-gray-200 pt-6">
//                 <div className="space-y-2 text-sm text-gray-600">
//                   <div className="flex justify-between">
//                     <span>SKU:</span>
//                     <span>{product.sku || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Category:</span>
//                     <span>{product.category_name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Seller:</span>
//                     <span>{product.seller_name}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Related Products */}
//         {product.related_products && product.related_products.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {product.related_products.map((relatedProduct) => (
//                 <ProductCard key={relatedProduct.id} product={relatedProduct} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;



// // src/pages/ProductDetail.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
// import { productsAPI } from '../services/api';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import LoadingSpinner from '../components/Common/LoadingSpinner';
// import ProductCard from '../components/Products/ProductCard';
// import toast from 'react-hot-toast';
// import { wishlistAPI } from '../services/api';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   const { addToCart } = useCart();
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const response = await productsAPI.getProduct(id);
//       console.log('Product API response:', response.data);
//       setProduct(response.data);
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       toast.error('Product not found');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get the correct image URL
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }

//     if (imagePath.startsWith('/uploads/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//     }

//     // If it's just a filename without path, add the uploads path
//     if (!imagePath.includes('/')) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
//     }

//     // Default case
//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
//   };

//   // Get main image URL
//   const getMainImage = () => {
//     if (!product) return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
    
//     // If we have multiple images array
//     if (product.images && product.images.length > 0) {
//       const image = product.images[selectedImage];
//       return getImageUrl(image?.image_url);
//     }
    
//     // If we have primary_image
//     if (product.primary_image) {
//       return getImageUrl(product.primary_image);
//     }
    
//     // Fallback to placeholder
//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//   };

//   // Get all images for gallery
//   const getAllImages = () => {
//     if (!product) return [];
    
//     // If we have multiple images
//     if (product.images && product.images.length > 0) {
//       return product.images.map(img => ({
//         ...img,
//         image_url: getImageUrl(img.image_url)
//       }));
//     }
    
//     // If we only have primary_image, create a single image array
//     if (product.primary_image) {
//       return [{
//         id: 1,
//         image_url: getImageUrl(product.primary_image),
//         is_primary: true
//       }];
//     }
    
//     return [];
//   };

//   const handleWishlist = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!user) {
//       toast.error('Please login to add items to wishlist');
//       navigate('/login');
//       return;
//     }

//     try {
//       if (isInWishlist) {
//         await wishlistAPI.removeFromWishlist(product.id);
//         setIsInWishlist(false);
//         toast.success('Removed from wishlist!');
//       } else {
//         await wishlistAPI.addToWishlist(product.id);
//         setIsInWishlist(true);
//         toast.success('Added to wishlist!');
//       }
//     } catch (error) {
//       toast.error('Failed to update wishlist');
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       toast.error('Please login to add items to cart');
//       navigate('/login');
//       return;
//     }

//     try {
//       await addToCart(product.id, quantity);
//       toast.success('Product added to cart!');
//     } catch (error) {
//       toast.error('Failed to add product to cart');
//     }
//   };

//   const handleImageError = () => {
//     console.log('Image failed to load');
//     setImageError(true);
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
//           <button
//             onClick={() => navigate('/products')}
//             className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
//           >
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const images = getAllImages();
//   const mainImageUrl = getMainImage();

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back
//         </button>

//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
//             {/* Product Images */}
//             <div>
//               <div className="mb-4">
//                 <img
//                   src={imageError ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300` : mainImageUrl}
//                   alt={product.name}
//                   className="w-full h-96 object-cover rounded-lg"
//                   onError={handleImageError}
//                 />
//               </div>
//               {images.length > 1 && (
//                 <div className="grid grid-cols-4 gap-2">
//                   {images.map((image, index) => (
//                     <button
//                       key={image.id}
//                       onClick={() => setSelectedImage(index)}
//                       className={`border-2 rounded-lg overflow-hidden ${
//                         selectedImage === index ? 'border-primary-500' : 'border-gray-200'
//                       }`}
//                     >
//                       <img
//                         src={image.image_url}
//                         alt={`${product.name} ${index + 1}`}
//                         className="w-full h-20 object-cover"
//                         onError={handleImageError}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Product Info */}
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
//               <div className="flex items-center mb-4">
//                 <div className="flex items-center">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`w-5 h-5 ${
//                         star <= Math.round(product.average_rating || 0)
//                           ? 'text-yellow-400 fill-current'
//                           : 'text-gray-300'
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-gray-600 ml-2">
//                   ({product.review_count || 0} reviews)
//                 </span>
//               </div>

//               <div className="mb-6">
//                 {product.compare_price && product.compare_price > product.price ? (
//                   <div className="flex items-center space-x-4">
//                     <span className="text-3xl font-bold text-gray-900">${product.price}</span>
//                     <span className="text-xl text-gray-500 line-through">${product.compare_price}</span>
//                     <span className="text-lg text-red-600 font-semibold">
//                       {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
//                     </span>
//                   </div>
//                 ) : (
//                   <span className="text-3xl font-bold text-gray-900">${product.price}</span>
//                 )}
//               </div>

//               <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

//               <div className="mb-6">
//                 <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
//                   product.quantity > 0 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
//                 </span>
//               </div>

//               {product.quantity > 0 && (
//                 <div className="flex items-center space-x-4 mb-6">
//                   <div className="flex items-center border border-gray-300 rounded-lg">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                     >
//                       -
//                     </button>
//                     <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
//                     <button
//                       onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
//                       className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                     >
//                       +
//                     </button>
//                   </div>
                  
//                   <button
//                     onClick={handleAddToCart}
//                     className="flex-1 bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
//                   >
//                     <ShoppingCart className="w-5 h-5" />
//                     <span>Add to Cart</span>
//                   </button>

//                   <button
//                     onClick={handleWishlist}
//                     className={`ml-2 p-2 rounded-full border transition-colors ${
//                       isInWishlist 
//                         ? 'bg-red-50 border-red-200 text-red-500' 
//                         : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
//                     }`}
//                     aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
//                   >
//                     <Heart 
//                       className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} 
//                     />
//                   </button>
//                 </div>
//               )}

//               <div className="border-t border-gray-200 pt-6">
//                 <div className="space-y-2 text-sm text-gray-600">
//                   <div className="flex justify-between">
//                     <span>SKU:</span>
//                     <span>{product.sku || 'N/A'}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Category:</span>
//                     <span>{product.category_name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Seller:</span>
//                     <span>{product.seller_name}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Related Products */}
//         {product.related_products && product.related_products.length > 0 && (
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {product.related_products.map((relatedProduct) => (
//                 <ProductCard key={relatedProduct.id} product={relatedProduct} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;



// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { productsAPI, wishlistAPI,reviewsAPI ,ordersAPI  } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ProductCard from '../components/Products/ProductCard';
import toast from 'react-hot-toast';
import ProductReviews from '../components/Reviews/ProductReviews';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'reviews', 'shipping'
  const [canReview, setCanReview] = useState(false);
  const [checkingReviewEligibility, setCheckingReviewEligibility] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus();
    }
  }, [user, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('Fetching product with ID:', id);
      const response = await productsAPI.getProduct(id);
      console.log('Product API response:', response.data);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      console.error('Error response:', error.response);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
  try {
    console.log('Checking wishlist status for product:', product.id);
    const response = await wishlistAPI.checkWishlist(product.id);
    console.log('Wishlist check response:', response.data);
    setIsInWishlist(response.data.isInWishlist || false);
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    // If check endpoint doesn't exist or fails, fallback to getting full wishlist
    await checkWishlistFallback();
  }
};


const checkReviewEligibility = async () => {
    if (!user || !product) return;
    
    try {
      setCheckingReviewEligibility(true);
      
      // First, check if user has already reviewed this product
      try {
        const reviewResponse = await reviewsAPI.getUserReview(product.id);
        const hasExistingReview = reviewResponse.data.review !== null;
        
        if (hasExistingReview) {
          setCanReview(false);
          setCheckingReviewEligibility(false);
          return;
        }
      } catch (error) {
        console.log('No existing review found or error checking:', error);
        // Continue to check purchase eligibility
      }

      // Check if user has purchased this product within last 30 days
      const hasPurchased = await checkPurchaseHistory();
      setCanReview(hasPurchased);
      
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    } finally {
      setCheckingReviewEligibility(false);
    }
  };

    // Real implementation with API call
  const checkPurchaseHistory = async () => {
    try {
      console.log('Checking purchase history for product:', product.id);
      const response = await ordersAPI.checkProductPurchase(product.id);
      console.log('Purchase check response:', response.data);
      
      if (response.data.hasPurchased) {
        setPurchaseDetails(response.data.purchaseDetails);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking purchase history:', error);
      
      // If the endpoint doesn't exist yet, fall back to mock data for development
      if (error.response?.status === 404) {
        console.log('Purchase check endpoint not available, using mock data');
        // For development, you might want to return true to test the review flow
        // In production, this should return false
        return process.env.NODE_ENV === 'development';
      }
      
      return false;
    }
  };

const checkWishlistFallback = async () => {
  try {
    const response = await wishlistAPI.getWishlist();
    console.log('Full wishlist response:', response.data);
    
    // Handle different possible response structures
    const wishlistItems = response.data.wishlist || response.data.items || response.data;
    
    const isProductInWishlist = wishlistItems.some(item => {
      // Check various possible ID fields
      const itemProductId = item.product_id || item.product?.id || item.id;
      return itemProductId === product.id || itemProductId === parseInt(product.id);
    });
    
    console.log('Product in wishlist (fallback):', isProductInWishlist);
    setIsInWishlist(isProductInWishlist);
  } catch (error) {
    console.error('Error in wishlist fallback check:', error);
    setIsInWishlist(false); // Default to false if we can't determine
  }
};

  // Get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    if (imagePath.startsWith('/uploads/')) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
    }

    // If it's just a filename without path, add the uploads path
    if (!imagePath.includes('/')) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
    }

    // Default case
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
  };

  // Get main image URL
  const getMainImage = () => {
    if (!product) return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
    
    // If we have multiple images array
    if (product.images && product.images.length > 0) {
      const image = product.images[selectedImage];
      return getImageUrl(image?.image_url || image?.url);
    }
    
    // If we have primary_image
    if (product.primary_image) {
      return getImageUrl(product.primary_image);
    }
    
    // Fallback to placeholder
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
  };

  // Get all images for gallery
  const getAllImages = () => {
    if (!product) return [];
    
    // If we have multiple images
    if (product.images && product.images.length > 0) {
      return product.images.map(img => ({
        ...img,
        image_url: getImageUrl(img.image_url || img.url)
      }));
    }
    
    // If we only have primary_image, create a single image array
    if (product.primary_image) {
      return [{
        id: 1,
        image_url: getImageUrl(product.primary_image),
        is_primary: true
      }];
    }
    
    return [];
  };

  // const handleWishlist = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
    
  //   if (!user) {
  //     toast.error('Please login to add items to wishlist');
  //     navigate('/login');
  //     return;
  //   }

  //   if (!product?.id) {
  //     toast.error('Product information is missing');
  //     return;
  //   }

  //   setWishlistLoading(true);
  //   try {
  //     if (isInWishlist) {
  //       console.log('Removing from wishlist, product ID:', product.id);
  //       await wishlistAPI.removeFromWishlist(product.id);
  //       setIsInWishlist(false);
  //       toast.success('Removed from wishlist!');
  //     } else {
  //       console.log('Adding to wishlist, product ID:', product.id);
  //       const response = await wishlistAPI.addToWishlist(product.id);
  //       console.log('Wishlist add response:', response.data);
  //       setIsInWishlist(true);
  //       toast.success('Added to wishlist!');
  //     }
  //   } catch (error) {
  //     console.error('Wishlist error details:', error);
  //     console.error('Error response:', error.response);
      
  //     if (error.response?.status === 401) {
  //       toast.error('Please login again');
  //       navigate('/login');
  //     } else if (error.response?.status === 404) {
  //       toast.error('Product not found');
  //     } else {
  //       toast.error(error.response?.data?.message || 'Failed to update wishlist');
  //     }
  //   } finally {
  //     setWishlistLoading(false);
  //   }
  // };
const handleWishlist = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (!user) {
    toast.error('Please login to add items to wishlist');
    navigate('/login');
    return;
  }

  if (!product?.id) {
    toast.error('Product information is missing');
    return;
  }

  setWishlistLoading(true);
  try {
    if (isInWishlist) {
      console.log('Removing from wishlist, product ID:', product.id);
      await wishlistAPI.removeFromWishlist(product.id);
      setIsInWishlist(false);
      toast.success('Removed from wishlist!');
    } else {
      console.log('Adding to wishlist, product ID:', product.id);
      const response = await wishlistAPI.addToWishlist(product.id);
      console.log('Wishlist add response:', response);
      setIsInWishlist(true);
      toast.success('Added to wishlist!');
    }
  } catch (error) {
    console.error('Wishlist error details:', error);
    
    // Handle "already in wishlist" error by syncing state
    if (error.response?.status === 400 && 
        error.response?.data?.message === 'Product already in wishlist') {
      setIsInWishlist(true); // Sync frontend state with backend reality
      toast.error('Product is already in your wishlist');
    } else if (error.response?.status === 401) {
      toast.error('Please login again');
      navigate('/login');
    } else if (error.response?.status === 404) {
      toast.error('Product not found');
    } else {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  } finally {
    setWishlistLoading(false);
  }
};
  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!product || !product.id) {
      toast.error('Invalid product data');
      return;
    }

    if (product.quantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    setCartLoading(true);
    try {
      console.log('Adding to cart:', { productId: product.id, quantity });
      await addToCart(product.id, quantity);
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Cart error:', error);
      console.error('Error response:', error.response);
      toast.error(error.message || 'Failed to add product to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const handleImageError = (imageIndex) => {
    console.log(`Image ${imageIndex} failed to load`);
    setImageErrors(prev => ({ ...prev, [imageIndex]: true }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = getAllImages();
  const mainImageUrl = getMainImage();
  const categoryName = product?.category?.name || product?.category_name || 'Uncategorized';
  const sellerName = product?.seller?.name || product?.seller_name || 'Unknown Seller';


return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={imageErrors[selectedImage] ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300` : getMainImage()}
                  alt={product?.name}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={() => handleImageError(selectedImage)}
                />
              </div>
              {getAllImages().length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {getAllImages().map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setSelectedImage(index)}
                      className={`border-2 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={imageErrors[index] ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300` : image.image_url}
                        alt={`${product?.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                        onError={() => handleImageError(index)}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product?.name}</h1>
              
              {/* Rating display */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-lg">
                  {'★'.repeat(Math.round(product?.average_rating || 0))}
                  {'☆'.repeat(5 - Math.round(product?.average_rating || 0))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product?.average_rating ? parseFloat(product.average_rating).toFixed(1) : '0.0'}
                  {product?.review_count && ` (${product.review_count} reviews)`}
                </span>
              </div>

              <div className="mb-6">
                {product?.compare_price && product.compare_price > product.price ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    <span className="text-xl text-gray-500 line-through">${product.compare_price}</span>
                    <span className="text-lg text-red-600 font-semibold">
                      {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">${product?.price}</span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product?.description}</p>

              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  product?.quantity > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {product?.quantity > 0 && (
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300 min-w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      disabled={quantity >= product.quantity}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className="flex-1 bg-primary-500 text-gray-700 border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{cartLoading ? 'Adding...' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    className={`ml-2 p-2 rounded-full border transition-colors disabled:opacity-50 ${
                      isInWishlist 
                        ? 'bg-red-50 border-red-200 text-red-500' 
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} 
                    />
                  </button>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>SKU:</span>
                    <span>{product?.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{product?.category?.name || product?.category_name || 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seller:</span>
                    <span>{product?.seller?.name || product?.seller_name || 'Unknown Seller'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Quantity:</span>
                    <span>{product?.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({product?.review_count || 0})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'shipping'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product?.description}</p>
              </div>
            )}

             {activeTab === 'reviews' && (
        <ProductReviews 
          productId={id} 
          canReview={canReview}
          checkingReviewEligibility={checkingReviewEligibility}
          purchaseDetails={purchaseDetails}
        />
      )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-4 text-gray-700">
                  <p><strong>Free Shipping</strong> on orders over $50</p>
                  <p><strong>Standard Shipping:</strong> 3-5 business days</p>
                  <p><strong>Express Shipping:</strong> 1-2 business days</p>
                  <p><strong>Returns:</strong> 30-day money-back guarantee</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product?.related_products && product.related_products.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {product.related_products.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default ProductDetail;
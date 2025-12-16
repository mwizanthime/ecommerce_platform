// // src/components/Products/ProductCard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Star, Heart } from 'lucide-react';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { wishlistAPI } from '../../services/api';
// import toast from 'react-hot-toast';

// const ProductCard = ({ product }) => {
//   const { addToCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [isInWishlist, setIsInWishlist] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [currentImage, setCurrentImage] = useState(null); // Start with null to avoid empty string

//   // Check if product is in wishlist when component mounts or user changes
//   useEffect(() => {
//     const checkWishlistStatus = async () => {
//       if (user && product?.id) {
//         try {
//           const response = await wishlistAPI.checkWishlist(product.id);
//           setIsInWishlist(response.data.inWishlist);
//         } catch (error) {
//           console.error('Error checking wishlist status:', error);
//         }
//       }
//     };

//     checkWishlistStatus();
//   }, [user, product?.id]);

//   // Set up the product image URL
//   useEffect(() => {
//     if (product) {
//       const imageUrl = getProductImage();
//       console.log('Setting image URL:', imageUrl);
//       setCurrentImage(imageUrl);
//     }
//   }, [product]);

//   const getProductImage = () => {
//     // If we already have an image error, return placeholder
//     if (imageError) {
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//     }

//     // Check for primary image first
//     if (product.primary_image) {
//       console.log('Using primary_image:', product.primary_image);
      
//       // If it's already a full URL, use it as is
//       if (product.primary_image.startsWith('http')) {
//         return product.primary_image;
//       }
      
//       // If it starts with /uploads, use it directly
//       if (product.primary_image.startsWith('/uploads/')) {
//         return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.primary_image}`;
//       }
      
//       // If it's just a filename without path, add the uploads path
//       if (!product.primary_image.includes('/')) {
//         return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${product.primary_image}`;
//       }
      
//       // Default case
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.primary_image}`;
//     }

//     // Check for image_url as fallback
//     if (product.image_url) {
//       console.log('Using image_url:', product.image_url);
      
//       if (product.image_url.startsWith('http')) {
//         return product.image_url;
//       }
      
//       if (product.image_url.startsWith('/uploads/')) {
//         return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image_url}`;
//       }
      
//       if (!product.image_url.includes('/')) {
//         return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${product.image_url}`;
//       }
      
//       return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image_url}`;
//     }

//     // Return placeholder if no image
//     console.log('No image found, using placeholder');
//     return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
//   };

//   const handleImageError = () => {
//     console.log('Image failed to load:', currentImage);
//     setImageError(true);
//     // Use the placeholder from our API
//     setCurrentImage(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`);
//   };

//   const handleAddToCart = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!user) {
//       toast.error('Please login to add items to cart');
//       navigate('/login');
//       return;
//     }

//     try {
//       await addToCart(product.id, 1);
//       toast.success('Product added to cart!');
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       toast.error('Failed to add product to cart');
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

//     if (wishlistLoading) return;

//     setWishlistLoading(true);
//     const wasInWishlist = isInWishlist;

//     try {
//       // Optimistic update
//       setIsInWishlist(!wasInWishlist);

//       if (wasInWishlist) {
//         await wishlistAPI.removeFromWishlist(product.id);
//         toast.success('Removed from wishlist!');
//       } else {
//         await wishlistAPI.addToWishlist(product.id);
//         toast.success('Added to wishlist!');
//       }
//     } catch (error) {
//       // Revert on error
//       setIsInWishlist(wasInWishlist);
//       console.error('Wishlist error:', error);
      
//       if (error.response?.status === 400) {
//         toast.error(error.response.data.message || 'Failed to update wishlist');
//       } else if (error.response?.status === 404) {
//         toast.error('Product not found');
//       } else {
//         toast.error('Failed to update wishlist. Please try again.');
//       }
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   // Safe fallbacks for product data
//   const displayPrice = product.compare_price && product.compare_price > product.price ? (
//     <div className="flex items-center space-x-2">
//       <span className="text-lg font-bold text-gray-900">${product.price}</span>
//       <span className="text-sm text-gray-500 line-through">${product.compare_price}</span>
//       <span className="text-sm text-red-600 font-semibold">
//         {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
//       </span>
//     </div>
//   ) : (
//     <span className="text-lg font-bold text-gray-900">${product.price}</span>
//   );

//   const averageRating = product.average_rating || 0;
//   const reviewCount = product.review_count || 0;
//   const productQuantity = product.quantity || 0;

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
//       <Link to={`/products/${product.id}`} className="block">
//         <div className="relative overflow-hidden">
//           {/* Only render img if currentImage is not null */}
//           {currentImage && (
//             <img
//               src={currentImage}
//               alt={product.name}
//               className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//               onError={handleImageError}
//               onLoad={() => console.log('Image loaded successfully:', currentImage)}
//             />
//           )}
//           {product.is_featured && (
//             <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
//               Featured
//             </div>
//           )}
//           {/* Out of stock overlay */}
//           {!productQuantity && (
//             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//               <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded">
//                 Out of Stock
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="p-4">
//           <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
//             {product.name}
//           </h3>
          
//           <div className="flex items-center mb-2">
//             <div className="flex items-center">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   className={`h-4 w-4 ${
//                     star <= Math.round(averageRating)
//                       ? 'text-yellow-400 fill-current'
//                       : 'text-gray-300'
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-sm text-gray-600 ml-1">
//               ({reviewCount})
//             </span>
//           </div>

//           <div className="flex items-center justify-between mt-3">
//             {displayPrice}
//           </div>
//         </div>
//       </Link>

//       {/* Action buttons - outside the Link to prevent navigation conflicts */}
//       <div className="flex items-center justify-between p-4 pt-0 mt-2">
//         <button
//           onClick={handleAddToCart}
//           disabled={!productQuantity}
//           className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
//             productQuantity
//               ? 'bg-blue-500 text-white hover:bg-blue-600'
//               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//           }`}
//         >
//           {productQuantity ? 'Add to Cart' : 'Out of Stock'}
//         </button>
        
//         <button
//           onClick={handleWishlist}
//           disabled={wishlistLoading || !productQuantity}
//           className={`ml-2 p-2 rounded-full border transition-colors ${
//             isInWishlist 
//               ? 'bg-red-50 border-red-200 text-red-500' 
//               : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
//           } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''} ${
//             !productQuantity ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//           aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
//         >
//           <Heart 
//             className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} 
//           />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;



// src/components/Products/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { wishlistAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // Check if product is in wishlist when component mounts or user changes
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user && product?.id) {
        try {
          const response = await wishlistAPI.checkWishlist(product.id);
          setIsInWishlist(response.data.inWishlist);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [user, product?.id]);

  // Set up the product image URL - FIXED VERSION
  useEffect(() => {
    if (product) {
      const imageUrl = getProductImage();
      console.log(`Product ${product.id} "${product.name}" - Image URL:`, imageUrl);
      setCurrentImage(imageUrl);
      setImageError(false); // Reset error state when product changes
    }
  }, [product]);

  const getProductImage = () => {
    // If we have a primary_image from the API, use it
    if (product.primary_image && product.primary_image !== '/api/placeholder/300/300') {
      console.log('Using primary_image:', product.primary_image);
      
      // If it's already a full URL, use it as is
      if (product.primary_image.startsWith('http')) {
        return product.primary_image;
      }
      
      // If it starts with /uploads/, use it directly
      if (product.primary_image.startsWith('/uploads/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.primary_image}`;
      }
      
      // If it's just a filename without path, add the uploads path
      if (!product.primary_image.includes('/')) {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${product.primary_image}`;
      }
      
      // Default case
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.primary_image}`;
    }

    // If no image available, use placeholder
    console.log('No product image available, using placeholder');
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`;
  };

  const handleImageError = () => {
    console.log('Image failed to load:', currentImage);
    setImageError(true);
    // Use the placeholder from our API
    setCurrentImage(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add product to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);
    const wasInWishlist = isInWishlist;

    try {
      // Optimistic update
      setIsInWishlist(!wasInWishlist);

      if (wasInWishlist) {
        await wishlistAPI.removeFromWishlist(product.id);
        toast.success('Removed from wishlist!');
      } else {
        await wishlistAPI.addToWishlist(product.id);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      // Revert on error
      setIsInWishlist(wasInWishlist);
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Safe fallbacks for product data
  const displayPrice = product.compare_price && product.compare_price > product.price ? (
    <div className="flex items-center space-x-2">
      <span className="text-lg font-bold text-gray-900">${product.price}</span>
      <span className="text-sm text-gray-500 line-through">${product.compare_price}</span>
      <span className="text-sm text-red-600 font-semibold">
        {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
      </span>
    </div>
  ) : (
    <span className="text-lg font-bold text-gray-900">${product.price}</span>
  );

  const averageRating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;
  const productQuantity = product.quantity || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Always render the image - it will show placeholder if no image */}
          <img
            src={currentImage || `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/placeholder/300/300`}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            onLoad={() => console.log('Image loaded successfully for product:', product.name)}
          />
          
          {product.is_featured && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
          
          {/* Out of stock overlay */}
          {productQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            {displayPrice}
          </div>
        </div>
      </Link>

      {/* Action buttons */}
      <div className="flex items-center justify-between p-4 pt-0 mt-2">
        <button
          onClick={handleAddToCart}
          disabled={productQuantity === 0}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            productQuantity > 0
              ? 'bg-blue-500 bg-white text-gray-700 hover:text-gray-700 border border-gray-300 '
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {productQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
        
        <button
          onClick={handleWishlist}
          disabled={wishlistLoading || productQuantity === 0}
          className={`ml-2 p-2 rounded-full border transition-colors ${
            isInWishlist 
              ? 'bg-red-50 border-red-200 text-red-500' 
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''} ${
            productQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} 
          />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
// // src/pages/Products.jsx
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { productsAPI } from '../services/api';
// import ProductCard from '../components/Products/ProductCard';
// import LoadingSpinner from '../components/Common/LoadingSpinner';

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchParams, setSearchParams] = useSearchParams();
  
//   const searchQuery = searchParams.get('search') || '';
//   const category = searchParams.get('category') || '';

//   useEffect(() => {
//     fetchProducts();
//   }, [searchQuery, category]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const params = {};
//       if (searchQuery) params.search = searchQuery;
//       if (category) params.category = category;
      
//       const response = await productsAPI.getProducts(params);
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
//           {searchQuery && (
//             <p className="text-gray-600">
//               Search results for: "{searchQuery}"
//             </p>
//           )}
//         </div>

//         {loading ? (
//           <LoadingSpinner />
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         )}

//         {!loading && products.length === 0 && (
//           <div className="text-center py-12">
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
//             <p className="text-gray-600">Try adjusting your search criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;


// // src/pages/Products.jsx
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { productsAPI } from '../services/api';
// import ProductCard from '../components/Products/ProductCard';
// import LoadingSpinner from '../components/Common/LoadingSpinner';

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchParams] = useSearchParams();
  
//   const searchQuery = searchParams.get('search') || '';
//   const category = searchParams.get('category') || '';

//   useEffect(() => {
//     fetchProducts();
//   }, [searchQuery, category]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const params = {};
//       if (searchQuery) params.search = searchQuery;
//       if (category) params.category = category;
      
//       console.log('Fetching products with params:', params); // Debug log
      
//       const response = await productsAPI.getProducts(params);
//       console.log('Products response:', response.data); // Debug log
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
//           {searchQuery && (
//             <p className="text-gray-600">
//               Search results for: "{searchQuery}"
//             </p>
//           )}
//           {category && !searchQuery && (
//             <p className="text-gray-600">
//               Showing products in category
//             </p>
//           )}
//         </div>

//         {loading ? (
//           <LoadingSpinner />
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>

//             {products.length === 0 && (
//               <div className="text-center py-12">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
//                 <p className="text-gray-600">
//                   {searchQuery 
//                     ? `No products found for "${searchQuery}". Try a different search term.`
//                     : 'No products available at the moment.'
//                   }
//                 </p>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;




// // src/pages/Products.jsx
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { productsAPI } from '../services/api';
// import ProductCard from '../components/Products/ProductCard';
// import LoadingSpinner from '../components/Common/LoadingSpinner';

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchParams] = useSearchParams();
  
//   const searchQuery = searchParams.get('search') || '';
//   const category = searchParams.get('category') || '';
//   const featured = searchParams.get('featured') || '';
//   const sortBy = searchParams.get('sortBy') || '';

//   useEffect(() => {
//     fetchProducts();
//   }, [searchQuery, category, featured, sortBy]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const params = {};
      
//       if (searchQuery) params.search = searchQuery;
//       if (category) params.category = category;
//       if (featured) params.featured = true;
//       if (sortBy) params.sortBy = sortBy;
      
//       console.log('Fetching products with params:', params);
      
//       const response = await productsAPI.getProducts(params);
//       console.log('Products response:', response.data);
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             {searchQuery ? `Search Results for "${searchQuery}"` : 
//              featured ? 'Featured Products' :
//              'All Products'}
//           </h1>
          
//           {products.length > 0 && (
//             <p className="text-gray-600">
//               Found {products.length} product{products.length !== 1 ? 's' : ''}
//               {searchQuery && ` for "${searchQuery}"`}
//             </p>
//           )}
//         </div>

//         {loading ? (
//           <LoadingSpinner />
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>

//             {products.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
//                   <p className="text-gray-600 mb-4">
//                     {searchQuery 
//                       ? `We couldn't find any products matching "${searchQuery}". Try a different search term.`
//                       : 'No products available at the moment.'
//                     }
//                   </p>
//                   {searchQuery && (
//                     <button
//                       onClick={() => window.location.href = '/products'}
//                       className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
//                     >
//                       View All Products
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Products;



// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/Products/ProductCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const featured = searchParams.get('featured') || '';

  useEffect(() => {
    console.log('URL Parameters changed:', { searchQuery, category, featured }); // Debug log
    fetchProducts();
  }, [searchQuery, category, featured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (searchQuery) {
        params.search = searchQuery;
        console.log('Searching for:', searchQuery); // Debug log
      }
      if (category) params.category = category;
      if (featured) params.featured = true;
      
      console.log('API call params:', params); // Debug log
      
      const response = await productsAPI.getProducts(params);
      console.log('API response:', response.data); // Debug log
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with search info */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {searchQuery 
                  ? `Search Results for "${searchQuery}"`
                  : featured 
                    ? 'Featured Products' 
                    : category
                      ? `Products in ${category}`
                      : 'All Products'
                }
              </h1>
              
              {searchQuery && products.length > 0 && (
                <p className="text-gray-600">
                  Found {products.length} product{products.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}
            </div>
            
            {(searchQuery || category || featured) && (
              <button
                onClick={clearSearch}
                className="text-primary-500 hover:text-primary-600 font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {searchQuery ? 'No products found' : 'No products available'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery 
                      ? `We couldn't find any products matching "${searchQuery}". Try a different search term.`
                      : 'Check back later for new products.'
                    }
                  </p>
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      View All Products
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
// // src/components/Search/SearchWithSuggestions.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, X } from 'lucide-react';
// import { productsAPI } from '../../services/api';
// import LoadingSpinner from '../Common/LoadingSpinner';

// const SearchWithSuggestions = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);
//   const navigate = useNavigate();
//   const searchRef = useRef(null);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (searchQuery.trim().length > 2) {
//         fetchSuggestions();
//       } else {
//         setSuggestions([]);
//         setIsLoading(false);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery]);

//   // Close suggestions when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const fetchSuggestions = async () => {
//     try {
//       setIsLoading(true);
//       const response = await productsAPI.getProducts({
//         search: searchQuery,
//         limit: 5
//       });
//       setSuggestions(response.data.products);
//       setHasSearched(true);
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//       setSuggestions([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//       setShowSuggestions(false);
//       setHasSearched(true);
//     }
//   };

//   const handleSuggestionClick = (product) => {
//     setSearchQuery(product.name);
//     navigate(`/products?search=${encodeURIComponent(product.name)}`);
//     setShowSuggestions(false);
//   };

//   const clearSearch = () => {
//     setSearchQuery('');
//     setSuggestions([]);
//     setHasSearched(false);
//     // Focus back on input after clear
//     if (searchRef.current) {
//       searchRef.current.focus();
//     }
//   };

//   const handleInputFocus = () => {
//     if (suggestions.length > 0 || searchQuery.length > 2) {
//       setShowSuggestions(true);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Escape') {
//       setShowSuggestions(false);
//     }
//   };

//   return (
//     <div className="relative" ref={searchRef}>
//       <form onSubmit={handleSearch} className="relative">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onFocus={handleInputFocus}
//             onKeyDown={handleKeyDown}
//             className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 text-gray-500 focus:ring-primary-500 focus:border-transparent"
//           />
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          
//           {searchQuery && (
//             <button
//               type="button"
//               onClick={clearSearch}
//               className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           )}
//         </div>
        
//         <button
//           type="submit"
//           className="absolute right-2 top-1 bg-primary-500 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-600 transition-colors opacity-0 pointer-events-none sr-only"
//         >
//           Search
//         </button>
//       </form>

//       {/* Suggestions Dropdown */}
//       {showSuggestions && (
//         <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
//           {/* Loading State */}
//           {isLoading && (
//             <div className="p-4 text-center">
//               <LoadingSpinner size="sm" />
//               <p className="text-sm text-gray-600 mt-2">Searching...</p>
//             </div>
//           )}

//           {/* Suggestions List */}
//           {!isLoading && suggestions.length > 0 && (
//             <div>
//               {suggestions.map((product) => (
//                 <div
//                   key={product.id}
//                   className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
//                   onClick={() => handleSuggestionClick(product)}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <img
//                       src={product.primary_image || '/api/placeholder/50/50'}
//                       alt={product.name}
//                       className="w-10 h-10 object-cover rounded"
//                       onError={(e) => {
//                         e.target.src = '/api/placeholder/50/50';
//                       }}
//                     />
//                     <div className="flex-1 min-w-0">
//                       <div className="font-medium text-gray-800 truncate">
//                         {product.name}
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         ${product.price}
//                         {product.category_name && (
//                           <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
//                             {product.category_name}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
              
//               {/* View All Results */}
//               <div
//                 className="p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer border-t border-gray-200 text-center font-medium text-primary-600"
//                 onClick={handleSearch}
//               >
//                 View all results for "{searchQuery}"
//               </div>
//             </div>
//           )}

//           {/* No Results */}
//           {!isLoading && hasSearched && suggestions.length === 0 && searchQuery.length > 2 && (
//             <div className="p-4 text-center text-gray-600">
//               <p className="font-medium">No products found</p>
//               <p className="text-sm mt-1">Try different keywords or browse categories</p>
//             </div>
//           )}

//           {/* Search Tips */}
//           {!isLoading && searchQuery.length <= 2 && searchQuery.length > 0 && (
//             <div className="p-3 text-center text-gray-500 text-sm">
//               Type at least 3 characters to search
//             </div>
//           )}

//           {/* Recent Searches (optional - you can implement this later) */}
//           {!isLoading && !hasSearched && searchQuery.length === 0 && (
//             <div className="p-3 text-center text-gray-500 text-sm">
//               Type to search products
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchWithSuggestions;


// src/components/Search/SearchWithSuggestions.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { productsAPI } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';

const SearchWithSuggestions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setIsLoading(false);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getProducts({
        search: searchQuery,
        limit: 5
      });
      console.log('Search suggestions response:', response.data); // Debug log
      setSuggestions(response.data.products || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery); // Debug log
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setHasSearched(true);
    }
  };

  const handleSuggestionClick = (product) => {
    console.log('Suggestion clicked:', product.name); // Debug log
    setSearchQuery(product.name);
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setHasSearched(false);
    // Focus back on input after clear
    if (searchRef.current) {
      const input = searchRef.current.querySelector('input');
      if (input) input.focus();
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 || searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <LoadingSpinner size="sm" />
              <p className="text-sm text-gray-600 mt-2">Searching...</p>
            </div>
          )}

          {/* Suggestions List */}
          {!isLoading && suggestions.length > 0 && (
            <div>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.primary_image || '/api/placeholder/50/50'}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/50/50';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${product.price}
                        {product.category_name && (
                          <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                            {product.category_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* View All Results */}
              <div
                className="p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer border-t border-gray-200 text-center font-medium text-primary-600"
                onClick={handleSearch}
              >
                View all results for "{searchQuery}"
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && hasSearched && suggestions.length === 0 && searchQuery.length > 0 && (
            <div className="p-4 text-center text-gray-600">
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try different keywords or browse categories</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !hasSearched && searchQuery.length === 0 && (
            <div className="p-3 text-center text-gray-500 text-sm">
              Type to search products
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;
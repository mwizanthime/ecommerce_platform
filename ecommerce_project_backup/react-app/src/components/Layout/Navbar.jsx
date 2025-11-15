// // frontend/src/components/Layout/Navbar.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import { useCart } from '../../context/CartContext';
// import SearchWithSuggestions from '../Search/SearchWithSuggestions';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const { user, logout } = useAuth();
//   const { cartItems } = useCart();
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
//             <span className="text-xl font-bold text-gray-800">ShopEasy</span>
//           </Link>

//           {/* Search Bar */}
//           <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
//             <div className="relative w-full">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//               />
//               <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             </div>
//           </form>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             <Link to="/products" className="text-gray-700 hover:text-primary-500 transition-colors">
//               Products
//             </Link>

//             {user ? (
//               <>
//                 <Link to="/cart" className="relative text-gray-700 hover:text-primary-500 transition-colors">
//                   <ShoppingCart className="h-6 w-6" />
//                   {cartItemCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                       {cartItemCount}
//                     </span>
//                   )}
//                 </Link>

//                 <div className="relative group">
//                   <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors">
//                     <User className="h-5 w-5" />
//                     <span>{user.username}</span>
//                   </button>
                  
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
//                     <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                       Profile
//                     </Link>
//                     {user.role === 'admin' || user.role === 'seller' ? (
//                       <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                         Dashboard
//                       </Link>
//                     ) : null}
//                     <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
//                       Orders
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link to="/login" className="text-gray-700 hover:text-primary-500 transition-colors">
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="bg-primary-500 text-gray-700 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100"
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t border-gray-200">
//             <form onSubmit={handleSearch} className="mb-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                 />
//                 <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               </div>
//             </form>

//             <div className="space-y-2">
//               <Link
//                 to="/products"
//                 className="block py-2 text-gray-700 hover:text-primary-500"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Products
//               </Link>

//               {user ? (
//                 <>
//                   <Link
//                     to="/cart"
//                     className="flex items-center py-2 text-gray-700 hover:text-primary-500"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <ShoppingCart className="h-5 w-5 mr-2" />
//                     Cart ({cartItemCount})
//                   </Link>
//                   <Link
//                     to="/profile"
//                     className="block py-2 text-gray-700 hover:text-primary-500"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Profile
//                   </Link>
//                   {user.role === 'admin' || user.role === 'seller' ? (
//                     <Link
//                       to="/dashboard"
//                       className="block py-2 text-gray-700 hover:text-primary-500"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Dashboard
//                     </Link>
//                   ) : null}
//                   <Link
//                     to="/orders"
//                     className="block py-2 text-gray-700 hover:text-primary-500"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Orders
//                   </Link>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                     }}
//                     className="block w-full text-left py-2 text-gray-700 hover:text-primary-500"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     className="block py-2 text-gray-700 hover:text-primary-500"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="block py-2 text-primary-500 font-semibold"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// frontend/src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchWithSuggestions from '../Search/SearchWithSuggestions';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
            <span className="text-xl font-bold text-gray-800">ShopEasy</span>
          </Link>

          {/* Search Bar - Replaced with SearchWithSuggestions */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchWithSuggestions />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary-500 transition-colors">
              Products
            </Link>

            {/* <Link to="/my-reviews" className="text-gray-700 hover:text-primary-500 transition-colors">
  My Reviews
</Link> */}

            {user ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-500 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-gray-700 text-small rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 transition-colors">
                    <User className="h-5 w-5" />
                    <span>{user.username}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    {user.role === 'admin' || user.role === 'seller' || user.role === 'customer' ? (
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                    ) : null}
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-gray-700 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search - Replaced with SearchWithSuggestions */}
            <div className="mb-4">
              <SearchWithSuggestions />
            </div>

            <div className="space-y-2">
              <Link
                to="/products"
                className="block py-2 text-gray-700 hover:text-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              {user ? (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({cartItemCount})
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' || user.role === 'seller' ? (
                    <Link
                      to="/dashboard"
                      className="block py-2 text-gray-700 hover:text-primary-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : null}
                  <Link
                    to="/orders"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-primary-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-gray-700 hover:text-primary-500 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
// // src/pages/seller/ProductManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { productsAPI, categoriesAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const ProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     compare_price: '',
//     cost_per_item: '',
//     category_id: '',
//     sku: '',
//     barcode: '',
//     quantity: '',
//     track_quantity: true,
//     is_published: true,
//     is_featured: false,
//     requires_shipping: true,
//     weight: '',
//     seo_title: '',
//     seo_description: ''
//   });

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await productsAPI.getProducts();
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await categoriesAPI.getCategories();
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//       // In a real app, you would handle file upload here
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const productData = new FormData();
      
//       // Append all form data
//       Object.keys(formData).forEach(key => {
//         productData.append(key, formData[key]);
//       });

//       // Append images if any
//       if (e.target.images.files.length > 0) {
//         for (let i = 0; i < e.target.images.files.length; i++) {
//           productData.append('images', e.target.images.files[i]);
//         }
//       }

//       if (editingProduct) {
//         await productsAPI.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated successfully');
//       } else {
//         await productsAPI.createProduct(productData);
//         toast.success('Product added successfully');
//       }

//       setShowAddProduct(false);
//       setEditingProduct(null);
//       setFormData({
//         name: '',
//         description: '',
//         price: '',
//         compare_price: '',
//         cost_per_item: '',
//         category_id: '',
//         sku: '',
//         barcode: '',
//         quantity: '',
//         track_quantity: true,
//         is_published: true,
//         is_featured: false,
//         requires_shipping: true,
//         weight: '',
//         seo_title: '',
//         seo_description: ''
//       });
//       setImagePreview(null);
      
//       fetchProducts();
//     } catch (error) {
//       console.error('Error saving product:', error);
//       toast.error('Failed to save product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setFormData({
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       compare_price: product.compare_price,
//       cost_per_item: product.cost_per_item,
//       category_id: product.category_id,
//       sku: product.sku,
//       barcode: product.barcode,
//       quantity: product.quantity,
//       track_quantity: product.track_quantity,
//       is_published: product.is_published,
//       is_featured: product.is_featured,
//       requires_shipping: product.requires_shipping,
//       weight: product.weight,
//       seo_title: product.seo_title,
//       seo_description: product.seo_description
//     });
//     setShowAddProduct(true);
//   };

//   const handleDelete = async (productId) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) {
//       return;
//     }

//     try {
//       await productsAPI.deleteProduct(productId);
//       toast.success('Product deleted successfully');
//       fetchProducts();
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   if (loading && !showAddProduct) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
//         <button
//           onClick={() => setShowAddProduct(true)}
//           className="bg-primary-500 text-gray-700 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
//         >
//           Add New Product
//         </button>
//       </div>

//       {/* Add/Edit Product Form */}
//       {showAddProduct && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h3 className="text-xl font-semibold mb-4">
//             {editingProduct ? 'Edit Product' : 'Add New Product'}
//           </h3>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                 <select
//                   name="category_id"
//                   value={formData.category_id}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(category => (
//                     <option key={category.id} value={category.id}>{category.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//             </div>

//             {/* Pricing */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Compare Price ($)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="compare_price"
//                   value={formData.compare_price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Item ($)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="cost_per_item"
//                   value={formData.cost_per_item}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//             </div>

//             {/* Inventory */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
//                 <input
//                   type="text"
//                   name="sku"
//                   value={formData.sku}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Images */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
//               <input
//                 type="file"
//                 name="images"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//               {imagePreview && (
//                 <div className="mt-2">
//                   <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
//                 </div>
//               )}
//             </div>

//             {/* Options */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="track_quantity"
//                     checked={formData.track_quantity}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Track quantity</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="is_published"
//                     checked={formData.is_published}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Published</span>
//                 </label>
//               </div>
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="is_featured"
//                     checked={formData.is_featured}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Featured product</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="requires_shipping"
//                     checked={formData.requires_shipping}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Requires shipping</span>
//                 </label>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowAddProduct(false);
//                   setEditingProduct(null);
//                   setFormData({
//                     name: '',
//                     description: '',
//                     price: '',
//                     compare_price: '',
//                     cost_per_item: '',
//                     category_id: '',
//                     sku: '',
//                     barcode: '',
//                     quantity: '',
//                     track_quantity: true,
//                     is_published: true,
//                     is_featured: false,
//                     requires_shipping: true,
//                     weight: '',
//                     seo_title: '',
//                     seo_description: ''
//                   });
//                   setImagePreview(null);
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-primary-500 border-gray-300 text-gray-700 rounded-md hover:bg-primary-600 disabled:opacity-50"
//               >
//                 {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Products List */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Product
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Stock
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products.map((product) => (
//               <tr key={product.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       <img
//                         className="h-10 w-10 rounded-full object-cover"
//                         src={product.primary_image || '/api/placeholder/40/40'}
//                         alt={product.name}
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                       <div className="text-sm text-gray-500">{product.category_name}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">${product.price}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{product.quantity}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {product.is_published ? (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                       Published
//                     </span>
//                   ) : (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                       Draft
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button
//                     onClick={() => handleEdit(product)}
//                     className="text-primary-600 hover:text-primary-900"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductManagement;


// // src/pages/seller/ProductManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { productsAPI, categoriesAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const ProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [stockAdjustment, setStockAdjustment] = useState({
//     productId: null,
//     type: 'in',
//     quantity: '',
//     reason: ''
//   });
//   const [showStockModal, setShowStockModal] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     compare_price: '',
//     cost_per_item: '',
//     category_id: '',
//     sku: '',
//     barcode: '',
//     quantity: '0',
//     track_quantity: true,
//     is_published: true,
//     is_featured: false,
//     requires_shipping: true,
//     weight: '',
//     seo_title: '',
//     seo_description: ''
//   });

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await productsAPI.getProducts();
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await categoriesAPI.getCategories();
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles(files);
    
//     if (files.length > 0) {
//       setImagePreview(URL.createObjectURL(files[0]));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const productData = new FormData();
      
//       // Append all form data - convert numbers and booleans properly
//       Object.keys(formData).forEach(key => {
//         let value = formData[key];
        
//         // Convert numeric fields
//         if (['price', 'compare_price', 'cost_per_item', 'quantity', 'weight'].includes(key)) {
//           value = value ? parseFloat(value) : 0;
//         }
        
//         // Convert boolean fields
//         if (['track_quantity', 'is_published', 'is_featured', 'requires_shipping'].includes(key)) {
//           value = value ? 1 : 0;
//         }
        
//         productData.append(key, value);
//       });

//       // Append images if any
//       if (selectedFiles.length > 0) {
//         selectedFiles.forEach(file => {
//           productData.append('images', file);
//         });
//       }

//       if (editingProduct) {
//         await productsAPI.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated successfully');
//       } else {
//         await productsAPI.createProduct(productData);
//         toast.success('Product added successfully');
//       }

//       setShowAddProduct(false);
//       setEditingProduct(null);
//       setFormData({
//         name: '',
//         description: '',
//         price: '',
//         compare_price: '',
//         cost_per_item: '',
//         category_id: '',
//         sku: '',
//         barcode: '',
//         quantity: '0',
//         track_quantity: true,
//         is_published: true,
//         is_featured: false,
//         requires_shipping: true,
//         weight: '',
//         seo_title: '',
//         seo_description: ''
//       });
//       setImagePreview(null);
//       setSelectedFiles([]);
      
//       fetchProducts();
//     } catch (error) {
//       console.error('Error saving product:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to save product';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setFormData({
//       name: product.name || '',
//       description: product.description || '',
//       price: product.price || '',
//       compare_price: product.compare_price || '',
//       cost_per_item: product.cost_per_item || '',
//       category_id: product.category_id || '',
//       sku: product.sku || '',
//       barcode: product.barcode || '',
//       quantity: product.quantity || '0',
//       track_quantity: product.track_quantity !== undefined ? product.track_quantity : true,
//       is_published: product.is_published !== undefined ? product.is_published : true,
//       is_featured: product.is_featured || false,
//       requires_shipping: product.requires_shipping !== undefined ? product.requires_shipping : true,
//       weight: product.weight || '',
//       seo_title: product.seo_title || '',
//       seo_description: product.seo_description || ''
//     });
//     setShowAddProduct(true);
//   };

//   const handleDelete = async (productId) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) {
//       return;
//     }

//     try {
//       await productsAPI.deleteProduct(productId);
//       toast.success('Product deleted successfully');
//       fetchProducts();
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       toast.error('Failed to delete product');
//     }
//   };

//   // Stock Management Functions
//   const handleStockAdjustment = async (e) => {
//     e.preventDefault();
    
//     if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
//       toast.error('Please enter a valid quantity');
//       return;
//     }

//     try {
//       const adjustmentData = {
//         adjustment: stockAdjustment.type === 'in' ? 
//           parseInt(stockAdjustment.quantity) : 
//           -parseInt(stockAdjustment.quantity),
//         reason: stockAdjustment.reason || 'Stock adjustment'
//       };

//       await productsAPI.adjustStock(stockAdjustment.productId, adjustmentData);
//       toast.success(`Stock ${stockAdjustment.type === 'in' ? 'added' : 'removed'} successfully`);
      
//       setShowStockModal(false);
//       setStockAdjustment({
//         productId: null,
//         type: 'in',
//         quantity: '',
//         reason: ''
//       });
      
//       fetchProducts(); // Refresh products list
//     } catch (error) {
//       console.error('Error adjusting stock:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to adjust stock';
//       toast.error(errorMessage);
//     }
//   };

//   const openStockModal = (product, type = 'in') => {
//     setStockAdjustment({
//       productId: product.id,
//       type: type,
//       quantity: '',
//       reason: ''
//     });
//     setShowStockModal(true);
//   };

//   if (loading && !showAddProduct) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
//         <button
//           onClick={() => setShowAddProduct(true)}
//           className="bg-primary-500 text-gray-700 px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
//         >
//           Add New Product
//         </button>
//       </div>

//       {/* Stock Adjustment Modal */}
//       {showStockModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">
//               {stockAdjustment.type === 'in' ? 'Add Stock' : 'Remove Stock'}
//             </h3>
            
//             <form onSubmit={handleStockAdjustment}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quantity
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={stockAdjustment.quantity}
//                   onChange={(e) => setStockAdjustment(prev => ({
//                     ...prev,
//                     quantity: e.target.value
//                   }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Reason
//                 </label>
//                 <input
//                   type="text"
//                   value={stockAdjustment.reason}
//                   onChange={(e) => setStockAdjustment(prev => ({
//                     ...prev,
//                     reason: e.target.value
//                   }))}
//                   placeholder="e.g., Damaged goods, New shipment, etc."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowStockModal(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className={`px-4 py-2 text-white rounded-md ${
//                     stockAdjustment.type === 'in' 
//                       ? 'bg-green-600 hover:bg-green-700' 
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   {stockAdjustment.type === 'in' ? 'Add Stock' : 'Remove Stock'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Product Form */}
//       {showAddProduct && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h3 className="text-xl font-semibold mb-4">
//             {editingProduct ? 'Edit Product' : 'Add New Product'}
//           </h3>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
//                 <select
//                   name="category_id"
//                   value={formData.category_id}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(category => (
//                     <option key={category.id} value={category.id}>{category.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//             </div>

//             {/* Pricing */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Compare Price ($)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="compare_price"
//                   value={formData.compare_price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Item ($)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="cost_per_item"
//                   value={formData.cost_per_item}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//             </div>

//             {/* Inventory */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
//                 <input
//                   type="text"
//                   name="sku"
//                   value={formData.sku}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
//                 <input
//                   type="text"
//                   name="barcode"
//                   value={formData.barcode}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Initial Quantity *</label>
//                 <input
//                   type="number"
//                   min="0"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Shipping */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="weight"
//                   value={formData.weight}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//             </div>

//             {/* Images */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
//               <input
//                 type="file"
//                 name="images"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//               {imagePreview && (
//                 <div className="mt-2">
//                   <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
//                 </div>
//               )}
//             </div>

//             {/* SEO */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
//                 <input
//                   type="text"
//                   name="seo_title"
//                   value={formData.seo_title}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
//                 <textarea
//                   name="seo_description"
//                   value={formData.seo_description}
//                   onChange={handleInputChange}
//                   rows="2"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 />
//               </div>
//             </div>

//             {/* Options */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="track_quantity"
//                     checked={formData.track_quantity}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Track quantity</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="is_published"
//                     checked={formData.is_published}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Published</span>
//                 </label>
//               </div>
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="is_featured"
//                     checked={formData.is_featured}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Featured product</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="requires_shipping"
//                     checked={formData.requires_shipping}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Requires shipping</span>
//                 </label>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowAddProduct(false);
//                   setEditingProduct(null);
//                   setFormData({
//                     name: '',
//                     description: '',
//                     price: '',
//                     compare_price: '',
//                     cost_per_item: '',
//                     category_id: '',
//                     sku: '',
//                     barcode: '',
//                     quantity: '0',
//                     track_quantity: true,
//                     is_published: true,
//                     is_featured: false,
//                     requires_shipping: true,
//                     weight: '',
//                     seo_title: '',
//                     seo_description: ''
//                   });
//                   setImagePreview(null);
//                   setSelectedFiles([]);
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-primary-500 text-gray-700 rounded-md hover:bg-primary-600 disabled:opacity-50"
//               >
//                 {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Products List */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Product
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Stock
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products.map((product) => (
//               <tr key={product.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       <img
//                         className="h-10 w-10 rounded-full object-cover"
//                         src={product.primary_image || '/api/placeholder/40/40'}
//                         alt={product.name}
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                       <div className="text-sm text-gray-500">{product.category_name}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">${product.price}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{product.quantity}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {product.is_published ? (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                       Published
//                     </span>
//                   ) : (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                       Draft
//                     </span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button
//                     onClick={() => handleEdit(product)}
//                     className="text-primary-600 hover:text-primary-900"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => openStockModal(product, 'in')}
//                     className="text-green-600 hover:text-green-900"
//                   >
//                     Stock In
//                   </button>
//                   <button
//                     onClick={() => openStockModal(product, 'out')}
//                     className="text-orange-600 hover:text-orange-900"
//                   >
//                     Stock Out
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductManagement;




// // src/pages/seller/ProductManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { productsAPI, categoriesAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const ProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [stockAdjustment, setStockAdjustment] = useState({
//     productId: null,
//     type: 'in',
//     quantity: '',
//     reason: ''
//   });
//   const [showStockModal, setShowStockModal] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     compare_price: '',
//     cost_per_item: '',
//     category_id: '',
//     sku: '',
//     barcode: '',
//     quantity: '0',
//     track_quantity: true,
//     is_published: true,
//     is_featured: false,
//     requires_shipping: true,
//     weight: '',
//     seo_title: '',
//     seo_description: ''
//   });

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);
  

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await productsAPI.getProducts();
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await categoriesAPI.getCategories();
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       toast.error('Failed to load categories');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles(files);
    
//     // Create preview URLs
//     const previews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(previews);
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setFormLoading(true);

//   //   try {
//   //     const productData = new FormData();
      
//   //     // Append all form data with proper formatting
//   //     Object.keys(formData).forEach(key => {
//   //       let value = formData[key];
        
//   //       // Convert numeric fields
//   //       if (['price', 'compare_price', 'cost_per_item', 'weight'].includes(key)) {
//   //         value = value ? parseFloat(value) : '';
//   //       }
        
//   //       // Convert quantity to integer
//   //       if (key === 'quantity') {
//   //         value = value ? parseInt(value) : 0;
//   //       }
        
//   //       // Convert boolean fields
//   //       if (['track_quantity', 'is_published', 'is_featured', 'requires_shipping'].includes(key)) {
//   //         value = value ? 1 : 0;
//   //       }
        
//   //       if (value !== null && value !== undefined) {
//   //         productData.append(key, value);
//   //       }
//   //     });

//   //     // Append images if any
//   //     if (selectedFiles.length > 0) {
//   //       selectedFiles.forEach(file => {
//   //         productData.append('images', file);
//   //       });
//   //     }

//   //     if (editingProduct) {
//   //       await productsAPI.updateProduct(editingProduct.id, productData);
//   //       toast.success('Product updated successfully');
//   //     } else {
//   //       await productsAPI.createProduct(productData);
//   //       toast.success('Product added successfully');
//   //     }

//   //     setShowAddProduct(false);
//   //     setEditingProduct(null);
//   //     resetForm();
//   //     fetchProducts();
//   //   } catch (error) {
//   //     console.error('Error saving product:', error);
//   //     const errorMessage = error.response?.data?.message || 'Failed to save product';
//   //     toast.error(errorMessage);
//   //   } finally {
//   //     setFormLoading(false);
//   //   }
//   // };

// // src/pages/seller/ProductManagement.jsx - Updated handleSubmit function
// // In your ProductManagement component - Update the handleSubmit function
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setFormLoading(true);

//   try {
//     let response;
    
//     if (editingProduct) {
//       const productData = {
//         name: formData.name,
//         description: formData.description,
//         price: parseFloat(formData.price) || 0,
//         compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
//         cost_per_item: formData.cost_per_item ? parseFloat(formData.cost_per_item) : null,
//         category_id: formData.category_id ? parseInt(formData.category_id) : null,
//         sku: formData.sku,
//         barcode: formData.barcode,
//         quantity: parseInt(formData.quantity) || 0,
//         track_quantity: Boolean(formData.track_quantity),
//         is_published: Boolean(formData.is_published),
//         is_featured: Boolean(formData.is_featured),
//         requires_shipping: Boolean(formData.requires_shipping),
//         weight: formData.weight ? parseFloat(formData.weight) : null,
//         seo_title: formData.seo_title,
//         seo_description: formData.seo_description
//       };

//       console.log('Sending update for product:', editingProduct.id);
//       console.log('Update data:', productData);
      
//       response = await productsAPI.updateProduct(editingProduct.id, productData);
//       toast.success('Product updated successfully');
//     } else {
//       // For new products, use FormData
//       const productData = new FormData();
      
//       Object.keys(formData).forEach(key => {
//         let value = formData[key];
        
//         if (['price', 'compare_price', 'cost_per_item', 'weight'].includes(key)) {
//           value = value ? parseFloat(value) : '';
//         }
        
//         if (key === 'quantity') {
//           value = value ? parseInt(value) : 0;
//         }
        
//         if (['track_quantity', 'is_published', 'is_featured', 'requires_shipping'].includes(key)) {
//           value = value ? 1 : 0;
//         }
        
//         if (value !== null && value !== undefined) {
//           productData.append(key, value);
//         }
//       });

//       if (selectedFiles.length > 0) {
//         selectedFiles.forEach(file => {
//           productData.append('images', file);
//         });
//       }

//       response = await productsAPI.createProduct(productData);
//       toast.success('Product added successfully');
//     }

//     setShowAddProduct(false);
//     setEditingProduct(null);
//     resetForm();
//     fetchProducts(); // Refresh the list
    
//   } catch (error) {
//     console.error('Error saving product:', error);
//     console.error('Error response:', error.response);
    
//     let errorMessage = 'Failed to save product';
    
//     if (error.response?.data?.message) {
//       errorMessage = error.response.data.message;
//     } else if (error.response?.status === 403) {
//       errorMessage = 'You do not have permission to update this product';
//     } else if (error.response?.status === 404) {
//       errorMessage = 'Product not found';
//     } else if (error.response?.status === 401) {
//       errorMessage = 'Please log in again';
//       // Redirect to login
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
    
//     toast.error(errorMessage);
//   } finally {
//     setFormLoading(false);
//   }
// };


//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       price: '',
//       compare_price: '',
//       cost_per_item: '',
//       category_id: '',
//       sku: '',
//       barcode: '',
//       quantity: '0',
//       track_quantity: true,
//       is_published: true,
//       is_featured: false,
//       requires_shipping: true,
//       weight: '',
//       seo_title: '',
//       seo_description: ''
//     });
//     setImagePreviews([]);
//     setSelectedFiles([]);
//   };

//   // const handleEdit = (product) => {
//   //   setEditingProduct(product);
//   //   setFormData({
//   //     name: product.name || '',
//   //     description: product.description || '',
//   //     price: product.price || '',
//   //     compare_price: product.compare_price || '',
//   //     cost_per_item: product.cost_per_item || '',
//   //     category_id: product.category_id || '',
//   //     sku: product.sku || '',
//   //     barcode: product.barcode || '',
//   //     quantity: product.quantity?.toString() || '0',
//   //     track_quantity: product.track_quantity !== undefined ? Boolean(product.track_quantity) : true,
//   //     is_published: product.is_published !== undefined ? Boolean(product.is_published) : true,
//   //     is_featured: Boolean(product.is_featured) || false,
//   //     requires_shipping: product.requires_shipping !== undefined ? Boolean(product.requires_shipping) : true,
//   //     weight: product.weight || '',
//   //     seo_title: product.seo_title || '',
//   //     seo_description: product.seo_description || ''
//   //   });
//   //   setShowAddProduct(true);
//   // };

// // Also fix the edit function to properly handle initial values
// const handleEdit = (product) => {
//   setEditingProduct(product);
//   setFormData({
//     name: product.name || '',
//     description: product.description || '',
//     price: product.price?.toString() || '',
//     compare_price: product.compare_price?.toString() || '',
//     cost_per_item: product.cost_per_item?.toString() || '',
//     category_id: product.category_id?.toString() || '',
//     sku: product.sku || '',
//     barcode: product.barcode || '',
//     quantity: product.quantity?.toString() || '0',
//     track_quantity: product.track_quantity !== undefined ? Boolean(product.track_quantity) : true,
//     is_published: product.is_published !== undefined ? Boolean(product.is_published) : true,
//     is_featured: Boolean(product.is_featured) || false,
//     requires_shipping: product.requires_shipping !== undefined ? Boolean(product.requires_shipping) : true,
//     weight: product.weight?.toString() || '',
//     seo_title: product.seo_title || '',
//     seo_description: product.seo_description || ''
//   });
//   setShowAddProduct(true);
// };


//   const handleDelete = async (productId) => {
//     if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       await productsAPI.deleteProduct(productId);
//       toast.success('Product deleted successfully');
//       fetchProducts();
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to delete product';
//       toast.error(errorMessage);
//     }
//   };

//   // Stock Management Functions
//   const handleStockAdjustment = async (e) => {
//     e.preventDefault();
    
//     if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
//       toast.error('Please enter a valid quantity');
//       return;
//     }

//     try {
//       const adjustmentData = {
//         adjustment: stockAdjustment.type === 'in' ? 
//           parseInt(stockAdjustment.quantity) : 
//           -parseInt(stockAdjustment.quantity),
//         reason: stockAdjustment.reason || 'Stock adjustment'
//       };

//       await productsAPI.adjustStock(stockAdjustment.productId, adjustmentData);
//       toast.success(`Stock ${stockAdjustment.type === 'in' ? 'added' : 'removed'} successfully`);
      
//       setShowStockModal(false);
//       setStockAdjustment({
//         productId: null,
//         type: 'in',
//         quantity: '',
//         reason: ''
//       });
      
//       fetchProducts();
//     } catch (error) {
//       console.error('Error adjusting stock:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to adjust stock';
//       toast.error(errorMessage);
//     }
//   };

//   const openStockModal = (product, type = 'in') => {
//     setStockAdjustment({
//       productId: product.id,
//       type: type,
//       quantity: '',
//       reason: ''
//     });
//     setShowStockModal(true);
//   };

//   if (loading && !showAddProduct) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
//         <button
//           onClick={() => {
//             setEditingProduct(null);
//             resetForm();
//             setShowAddProduct(true);
//           }}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Add New Product
//         </button>
//       </div>

//       {/* Stock Adjustment Modal */}
//       {showStockModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">
//               {stockAdjustment.type === 'in' ? 'Add Stock' : 'Remove Stock'}
//             </h3>
            
//             <form onSubmit={handleStockAdjustment}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quantity
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={stockAdjustment.quantity}
//                   onChange={(e) => setStockAdjustment(prev => ({
//                     ...prev,
//                     quantity: e.target.value
//                   }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Reason
//                 </label>
//                 <input
//                   type="text"
//                   value={stockAdjustment.reason}
//                   onChange={(e) => setStockAdjustment(prev => ({
//                     ...prev,
//                     reason: e.target.value
//                   }))}
//                   placeholder="e.g., Damaged goods, New shipment, etc."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowStockModal(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className={`px-4 py-2 text-white rounded-md ${
//                     stockAdjustment.type === 'in' 
//                       ? 'bg-green-600 hover:bg-green-700' 
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   {stockAdjustment.type === 'in' ? 'Add Stock' : 'Remove Stock'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Product Form */}
//       {showAddProduct && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h3 className="text-xl font-semibold mb-4">
//             {editingProduct ? 'Edit Product' : 'Add New Product'}
//           </h3>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                   placeholder="Enter product name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category *
//                 </label>
//                 <select
//                   name="category_id"
//                   value={formData.category_id}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(category => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter product description"
//               />
//             </div>

//             {/* Pricing */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Price ($) *
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Compare Price ($)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="compare_price"
//                   value={formData.compare_price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Cost per Item ($)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="cost_per_item"
//                   value={formData.cost_per_item}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Inventory */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SKU
//                 </label>
//                 <input
//                   type="text"
//                   name="sku"
//                   value={formData.sku}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Stock Keeping Unit"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Barcode
//                 </label>
//                 <input
//                   type="text"
//                   name="barcode"
//                   value={formData.barcode}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Product barcode"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Initial Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Shipping */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Weight (kg)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Images */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Images
//               </label>
//               <input
//                 type="file"
//                 name="images"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {imagePreviews.length > 0 && (
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {imagePreviews.map((preview, index) => (
//                     <img 
//                       key={index} 
//                       src={preview} 
//                       alt={`Preview ${index + 1}`} 
//                       className="w-24 h-24 object-cover rounded border" 
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* SEO */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SEO Title
//                 </label>
//                 <input
//                   type="text"
//                   name="seo_title"
//                   value={formData.seo_title}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SEO Description
//                 </label>
//                 <textarea
//                   name="seo_description"
//                   value={formData.seo_description}
//                   onChange={handleInputChange}
//                   rows="2"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Options */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="track_quantity"
//                     checked={formData.track_quantity}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Track quantity</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="is_published"
//                     checked={formData.is_published}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Published</span>
//                 </label>
//               </div>
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="is_featured"
//                     checked={formData.is_featured}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Featured product</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="requires_shipping"
//                     checked={formData.requires_shipping}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Requires shipping</span>
//                 </label>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowAddProduct(false);
//                   setEditingProduct(null);
//                   resetForm();
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={formLoading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {formLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Products List */}
//       {!showAddProduct && (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {products.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No products found.</p>
//             </div>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Price
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Stock
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <img
//                             className="h-10 w-10 rounded object-cover"
//                             src={product.primary_image || '/api/placeholder/40/40'}
//                             alt={product.name}
//                           />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                           <div className="text-sm text-gray-500">{product.category_name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">${product.price}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{product.quantity}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {product.is_published ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Published
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                           Draft
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => openStockModal(product, 'in')}
//                         className="text-green-600 hover:text-green-900"
//                       >
//                         Stock In
//                       </button>
//                       <button
//                         onClick={() => openStockModal(product, 'out')}
//                         className="text-orange-600 hover:text-orange-900"
//                       >
//                         Stock Out
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductManagement;



// //src/pages/seller/productManagement
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { productsAPI, categoriesAPI } from '../../services/api';
// import LoadingSpinner from '../../components/Common/LoadingSpinner';
// import toast from 'react-hot-toast';

// const ProductManagement = () => {
//   const { user } = useAuth();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [stockAdjustment, setStockAdjustment] = useState({
//     productId: null,
//     type: 'in',
//     quantity: '',
//     reason: ''
//   });
//   const [showStockModal, setShowStockModal] = useState(false);
//   const [formLoading, setFormLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     compare_price: '',
//     cost_per_item: '',
//     category_id: '',
//     sku: '',
//     barcode: '',
//     quantity: '0',
//     track_quantity: true,
//     is_published: true,
//     is_featured: false,
//     requires_shipping: true,
//     weight: '',
//     seo_title: '',
//     seo_description: ''
//   });

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   // Debug current user and products
//   useEffect(() => {
//     console.log('=== PRODUCT MANAGEMENT DEBUG ===');
//     console.log('Current user:', user);
//     console.log('Products loaded:', products.length);
//     console.log('Products with seller info:', products.map(p => ({
//       id: p.id, 
//       name: p.name, 
//       seller_id: p.seller_id,
//       owned_by_me: p.seller_id === user?.id
//     })));
//   }, [user, products]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching seller products...');
      
//       // Use the dedicated seller products endpoint
//       const response = await productsAPI.getSellerProducts();
//       console.log('Seller products response:', response.data);
      
//       if (response.data.success === false) {
//         throw new Error(response.data.message);
//       }
      
//       setProducts(response.data.products || []);
//       console.log(`Loaded ${response.data.products?.length || 0} products for current seller`);
      
//     } catch (error) {
//       console.error('Error fetching seller products:', error);
//       console.error('Error response:', error.response);
      
//       // Fallback to regular products API if seller endpoint fails
//       try {
//         console.log('Trying fallback to regular products API...');
//         const fallbackResponse = await productsAPI.getProducts();
//         setProducts(fallbackResponse.data.products || []);
//         console.log('Fallback successful, loaded products:', fallbackResponse.data.products?.length);
//       } catch (fallbackError) {
//         console.error('Fallback also failed:', fallbackError);
//         toast.error('Failed to load products');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await categoriesAPI.getCategories();
//       setCategories(response.data.categories);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       toast.error('Failed to load categories');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles(files);
    
//     // Create preview URLs
//     const previews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(previews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormLoading(true);

//     try {
//       let response;
      
//       if (editingProduct) {
//         const productData = {
//           name: formData.name,
//           description: formData.description,
//           price: parseFloat(formData.price) || 0,
//           compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
//           cost_per_item: formData.cost_per_item ? parseFloat(formData.cost_per_item) : null,
//           category_id: formData.category_id ? parseInt(formData.category_id) : null,
//           sku: formData.sku,
//           barcode: formData.barcode,
//           quantity: parseInt(formData.quantity) || 0,
//           track_quantity: Boolean(formData.track_quantity),
//           is_published: Boolean(formData.is_published),
//           is_featured: Boolean(formData.is_featured),
//           requires_shipping: Boolean(formData.requires_shipping),
//           weight: formData.weight ? parseFloat(formData.weight) : null,
//           seo_title: formData.seo_title,
//           seo_description: formData.seo_description
//         };

//         console.log('Sending update for product:', editingProduct.id);
//         console.log('Update data:', productData);
        
//         response = await productsAPI.updateProduct(editingProduct.id, productData);
//         toast.success('Product updated successfully');
//       } else {
//         // For new products, use FormData
//         const productData = new FormData();
        
//         Object.keys(formData).forEach(key => {
//           let value = formData[key];
          
//           if (['price', 'compare_price', 'cost_per_item', 'weight'].includes(key)) {
//             value = value ? parseFloat(value) : '';
//           }
          
//           if (key === 'quantity') {
//             value = value ? parseInt(value) : 0;
//           }
          
//           if (['track_quantity', 'is_published', 'is_featured', 'requires_shipping'].includes(key)) {
//             value = value ? 1 : 0;
//           }
          
//           if (value !== null && value !== undefined) {
//             productData.append(key, value);
//           }
//         });

//         if (selectedFiles.length > 0) {
//           selectedFiles.forEach(file => {
//             productData.append('images', file);
//           });
//         }

//         response = await productsAPI.createProduct(productData);
//         toast.success('Product added successfully');
//       }

//       setShowAddProduct(false);
//       setEditingProduct(null);
//       resetForm();
//       fetchProducts();
      
//     } catch (error) {
//       console.error('Error saving product:', error);
//       console.error('Error response:', error.response);
      
//       let errorMessage = 'Failed to save product';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.status === 403) {
//         errorMessage = 'You do not have permission to update this product';
//       } else if (error.response?.status === 404) {
//         errorMessage = 'Product not found';
//       } else if (error.response?.status === 401) {
//         errorMessage = 'Please log in again';
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/login';
//       }
      
//       toast.error(errorMessage);
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       price: '',
//       compare_price: '',
//       cost_per_item: '',
//       category_id: '',
//       sku: '',
//       barcode: '',
//       quantity: '0',
//       track_quantity: true,
//       is_published: true,
//       is_featured: false,
//       requires_shipping: true,
//       weight: '',
//       seo_title: '',
//       seo_description: ''
//     });
//     setImagePreviews([]);
//     setSelectedFiles([]);
//   };

//   const handleEdit = (product) => {
//     console.log('Editing product:', product);
//     console.log('Current user:', user);
//     console.log('Product seller_id:', product.seller_id);
    
//     // Check if current user owns this product
//     if (product.seller_id !== user?.id && user?.role !== 'admin') {
//       toast.error('You do not have permission to edit this product');
//       return;
//     }
    
//     setEditingProduct(product);
//     setFormData({
//       name: product.name || '',
//       description: product.description || '',
//       price: product.price?.toString() || '',
//       compare_price: product.compare_price?.toString() || '',
//       cost_per_item: product.cost_per_item?.toString() || '',
//       category_id: product.category_id?.toString() || '',
//       sku: product.sku || '',
//       barcode: product.barcode || '',
//       quantity: product.quantity?.toString() || '0',
//       track_quantity: product.track_quantity !== undefined ? Boolean(product.track_quantity) : true,
//       is_published: product.is_published !== undefined ? Boolean(product.is_published) : true,
//       is_featured: Boolean(product.is_featured) || false,
//       requires_shipping: product.requires_shipping !== undefined ? Boolean(product.requires_shipping) : true,
//       weight: product.weight?.toString() || '',
//       seo_title: product.seo_title || '',
//       seo_description: product.seo_description || ''
//     });
//     setShowAddProduct(true);
//   };

//   const handleDelete = async (productId) => {
//     if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       await productsAPI.deleteProduct(productId);
//       toast.success('Product deleted successfully');
//       fetchProducts();
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to delete product';
//       toast.error(errorMessage);
//     }
//   };

//   // Stock Management Functions
//   const handleStockAdjustment = async (e) => {
//     e.preventDefault();
    
//     if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
//       toast.error('Please enter a valid quantity');
//       return;
//     }

//     try {
//       const adjustment = stockAdjustment.type === 'in' ? 
//         parseInt(stockAdjustment.quantity) : 
//         -parseInt(stockAdjustment.quantity);

//       const adjustmentData = {
//         adjustment: adjustment,
//         reason: stockAdjustment.reason || `${stockAdjustment.type === 'in' ? 'Stock in' : 'Stock out'} adjustment`
//       };

//       console.log('Adjusting stock:', adjustmentData);
      
//       const response = await productsAPI.adjustStock(stockAdjustment.productId, adjustmentData);
//       toast.success(`Stock ${stockAdjustment.type === 'in' ? 'added' : 'removed'} successfully`);
      
//       setShowStockModal(false);
//       setStockAdjustment({
//         productId: null,
//         type: 'in',
//         quantity: '',
//         reason: ''
//       });
      
//       fetchProducts();
//     } catch (error) {
//       console.error('Error adjusting stock:', error);
//       console.error('Error response:', error.response);
//       const errorMessage = error.response?.data?.message || 'Failed to adjust stock';
//       toast.error(errorMessage);
//     }
//   };

//   const openStockModal = (product, type = 'in') => {
//     // Check if current user owns this product
//     if (product.seller_id !== user?.id && user?.role !== 'admin') {
//       toast.error('You do not have permission to adjust stock for this product');
//       return;
//     }
    
//     setStockAdjustment({
//       productId: product.id,
//       type: type,
//       quantity: '',
//       reason: ''
//     });
//     setShowStockModal(true);
//   };

//   if (loading && !showAddProduct) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
//         <button
//           onClick={() => {
//             setEditingProduct(null);
//             resetForm();
//             setShowAddProduct(true);
//           }}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Add New Product
//         </button>
//       </div>

//       {/* Stock Adjustment Modal */}
//       {showStockModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">
//               {stockAdjustment.type === 'in' ? 'Add Stock' : 'Remove Stock'}
//             </h3>
            
//             <form onSubmit={handleStockAdjustment}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quantity
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={stockAdjustment.quantity}
//                   onChange={(e) => setStockAdjustment(prev => ({
//                     ...prev,
//                     quantity: e.target.value
//                   }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Reason
//                 </label>
//                 <input
//                   type="text"
//                   value={stockAdjustment.reason}
//                   onChange={(e) => setStockAdjustment(prev => ({
//                     ...prev,
//                     reason: e.target.value
//                   }))}
//                   placeholder="e.g., Damaged goods, New shipment, etc."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowStockModal(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className={`px-4 py-2 text-white rounded-md ${
//                     stockAdjustment.type === 'in' 
//                       ? 'bg-green-600 hover:bg-green-700' 
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   {stockAdjustment.type === 'in' ? 'Add Stock' : 'Remove Stock'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add/Edit Product Form */}
//       {showAddProduct && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h3 className="text-xl font-semibold mb-4">
//             {editingProduct ? 'Edit Product' : 'Add New Product'}
//           </h3>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                   placeholder="Enter product name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category *
//                 </label>
//                 <select
//                   name="category_id"
//                   value={formData.category_id}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(category => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter product description"
//               />
//             </div>

//             {/* Pricing */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Price ($) *
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Compare Price ($)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="compare_price"
//                   value={formData.compare_price}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Cost per Item ($)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   name="cost_per_item"
//                   value={formData.cost_per_item}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Inventory */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SKU
//                 </label>
//                 <input
//                   type="text"
//                   name="sku"
//                   value={formData.sku}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Stock Keeping Unit"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Barcode
//                 </label>
//                 <input
//                   type="text"
//                   name="barcode"
//                   value={formData.barcode}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Product barcode"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Initial Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Shipping */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Weight (kg)
//               </label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 name="weight"
//                 value={formData.weight}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Images */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Images
//               </label>
//               <input
//                 type="file"
//                 name="images"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {imagePreviews.length > 0 && (
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {imagePreviews.map((preview, index) => (
//                     <img 
//                       key={index} 
//                       src={preview} 
//                       alt={`Preview ${index + 1}`} 
//                       className="w-24 h-24 object-cover rounded border" 
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* SEO */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SEO Title
//                 </label>
//                 <input
//                   type="text"
//                   name="seo_title"
//                   value={formData.seo_title}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   SEO Description
//                 </label>
//                 <textarea
//                   name="seo_description"
//                   value={formData.seo_description}
//                   onChange={handleInputChange}
//                   rows="2"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Options */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="track_quantity"
//                     checked={formData.track_quantity}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Track quantity</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="is_published"
//                     checked={formData.is_published}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Published</span>
//                 </label>
//               </div>
//               <div className="space-y-3">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="is_featured"
//                     checked={formData.is_featured}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Featured product</span>
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="requires_shipping"
//                     checked={formData.requires_shipping}
//                     onChange={handleInputChange}
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">Requires shipping</span>
//                 </label>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowAddProduct(false);
//                   setEditingProduct(null);
//                   resetForm();
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={formLoading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {formLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Products List */}
//       {!showAddProduct && (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           {products.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No products found.</p>
//               <button 
//                 onClick={fetchProducts}
//                 className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//               >
//                 Refresh
//               </button>
//             </div>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Price
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Stock
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {products.map((product) => (
//                   <tr key={product.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <img
//                             className="h-10 w-10 rounded object-cover"
//                             src={product.primary_image || '/api/placeholder/40/40'}
//                             alt={product.name}
//                           />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                           <div className="text-sm text-gray-500">{product.category_name}</div>
//                           {product.seller_id !== user?.id && (
//                             <div className="text-xs text-red-500 font-semibold">Not your product!</div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">${product.price}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{product.quantity}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {product.is_published ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                           Published
//                         </span>
//                       ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                           Draft
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => openStockModal(product, 'in')}
//                         className="text-green-600 hover:text-green-900"
//                       >
//                         Stock In
//                       </button>
//                       <button
//                         onClick={() => openStockModal(product, 'out')}
//                         className="text-orange-600 hover:text-orange-900"
//                       >
//                         Stock Out
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductManagement;







// src/pages/seller/productManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productsAPI, categoriesAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [stockAdjustment, setStockAdjustment] = useState({
    productId: null,
    type: 'in',
    quantity: '',
    reason: ''
  });
  const [showStockModal, setShowStockModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    cost_per_item: '',
    category_id: '',
    sku: '',
    barcode: '',
    quantity: '0',
    track_quantity: true,
    is_published: true,
    is_featured: false,
    requires_shipping: true,
    weight: '',
    seo_title: '',
    seo_description: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Debug current user and products
  useEffect(() => {
    console.log('=== PRODUCT MANAGEMENT DEBUG ===');
    console.log('Current user:', user);
    console.log('Products loaded:', products.length);
    console.log('Products with seller info:', products.map(p => ({
      id: p.id, 
      name: p.name, 
      seller_id: p.seller_id,
      owned_by_me: p.seller_id === user?.id
    })));
  }, [user, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching seller products...');
      
      // Use the dedicated seller products endpoint
      const response = await productsAPI.getSellerProducts();
      console.log('Seller products response:', response.data);
      
      if (response.data.success === false) {
        throw new Error(response.data.message);
      }
      
      setProducts(response.data.products || []);
      console.log(`Loaded ${response.data.products?.length || 0} products for current seller`);
      
    } catch (error) {
      console.error('Error fetching seller products:', error);
      console.error('Error response:', error.response);
      
      // Fallback to regular products API if seller endpoint fails
      try {
        console.log('Trying fallback to regular products API...');
        const fallbackResponse = await productsAPI.getProducts();
        setProducts(fallbackResponse.data.products || []);
        console.log('Fallback successful, loaded products:', fallbackResponse.data.products?.length);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        toast.error('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
      product.category_id?.toString() === categoryFilter;

    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && product.is_published) ||
      (statusFilter === 'draft' && !product.is_published);

    // Stock filter
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'in_stock' && product.quantity > 0) ||
      (stockFilter === 'out_of_stock' && product.quantity <= 0) ||
      (stockFilter === 'low_stock' && product.quantity > 0 && product.quantity <= 10);

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(products.map(p => p.category_name).filter(Boolean))];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let response;
      
      if (editingProduct) {
        const productData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
          cost_per_item: formData.cost_per_item ? parseFloat(formData.cost_per_item) : null,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          sku: formData.sku,
          barcode: formData.barcode,
          quantity: parseInt(formData.quantity) || 0,
          track_quantity: Boolean(formData.track_quantity),
          is_published: Boolean(formData.is_published),
          is_featured: Boolean(formData.is_featured),
          requires_shipping: Boolean(formData.requires_shipping),
          weight: formData.weight ? parseFloat(formData.weight) : null,
          seo_title: formData.seo_title,
          seo_description: formData.seo_description
        };

        console.log('Sending update for product:', editingProduct.id);
        console.log('Update data:', productData);
        
        response = await productsAPI.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        // For new products, use FormData
        const productData = new FormData();
        
        Object.keys(formData).forEach(key => {
          let value = formData[key];
          
          if (['price', 'compare_price', 'cost_per_item', 'weight'].includes(key)) {
            value = value ? parseFloat(value) : '';
          }
          
          if (key === 'quantity') {
            value = value ? parseInt(value) : 0;
          }
          
          if (['track_quantity', 'is_published', 'is_featured', 'requires_shipping'].includes(key)) {
            value = value ? 1 : 0;
          }
          
          if (value !== null && value !== undefined) {
            productData.append(key, value);
          }
        });

        if (selectedFiles.length > 0) {
          selectedFiles.forEach(file => {
            productData.append('images', file);
          });
        }

        response = await productsAPI.createProduct(productData);
        toast.success('Product added successfully');
      }

      setShowAddProduct(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
      
    } catch (error) {
      console.error('Error saving product:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Failed to save product';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to update this product';
      } else if (error.response?.status === 404) {
        errorMessage = 'Product not found';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in again';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      compare_price: '',
      cost_per_item: '',
      category_id: '',
      sku: '',
      barcode: '',
      quantity: '0',
      track_quantity: true,
      is_published: true,
      is_featured: false,
      requires_shipping: true,
      weight: '',
      seo_title: '',
      seo_description: ''
    });
    setImagePreviews([]);
    setSelectedFiles([]);
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    console.log('Current user:', user);
    console.log('Product seller_id:', product.seller_id);
    
    // Check if current user owns this product
    if (product.seller_id !== user?.id && user?.role !== 'admin') {
      toast.error('You do not have permission to edit this product');
      return;
    }
    
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      compare_price: product.compare_price?.toString() || '',
      cost_per_item: product.cost_per_item?.toString() || '',
      category_id: product.category_id?.toString() || '',
      sku: product.sku || '',
      barcode: product.barcode || '',
      quantity: product.quantity?.toString() || '0',
      track_quantity: product.track_quantity !== undefined ? Boolean(product.track_quantity) : true,
      is_published: product.is_published !== undefined ? Boolean(product.is_published) : true,
      is_featured: Boolean(product.is_featured) || false,
      requires_shipping: product.requires_shipping !== undefined ? Boolean(product.requires_shipping) : true,
      weight: product.weight?.toString() || '',
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || ''
    });
    setShowAddProduct(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await productsAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      toast.error(errorMessage);
    }
  };

  // Stock Management Functions
  const handleStockAdjustment = async (e) => {
    e.preventDefault();
    
    if (!stockAdjustment.quantity || stockAdjustment.quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      const adjustment = stockAdjustment.type === 'in' ? 
        parseInt(stockAdjustment.quantity) : 
        -parseInt(stockAdjustment.quantity);

      const adjustmentData = {
        adjustment: adjustment,
        reason: stockAdjustment.reason || `${stockAdjustment.type === 'in' ? 'Stock in' : 'Stock out'} adjustment`
      };

      console.log('Adjusting stock:', adjustmentData);
      
      const response = await productsAPI.adjustStock(stockAdjustment.productId, adjustmentData);
      toast.success(`Stock ${stockAdjustment.type === 'in' ? 'added' : 'removed'} successfully`);
      
      setShowStockModal(false);
      setStockAdjustment({
        productId: null,
        type: 'in',
        quantity: '',
        reason: ''
      });
      
      fetchProducts();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Failed to adjust stock';
      toast.error(errorMessage);
    }
  };

  const openStockModal = (product, type = 'in') => {
    // Check if current user owns this product
    if (product.seller_id !== user?.id && user?.role !== 'admin') {
      toast.error('You do not have permission to adjust stock for this product');
      return;
    }
    
    setStockAdjustment({
      productId: product.id,
      type: type,
      quantity: '',
      reason: ''
    });
    setShowStockModal(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setStockFilter('all');
  };

  if (loading && !showAddProduct) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowAddProduct(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      {/* Search and Filter Section */}
      {!showAddProduct && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, SKU, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status
              </label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stock</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="low_stock">Low Stock (&lt;10)</option>
              </select>
            </div>
          </div>

          {/* Results and Clear Filters */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
              {searchTerm && (
                <span> for "<strong>{searchTerm}</strong>"</span>
              )}
            </div>
            {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || stockFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {stockAdjustment.type === 'in' ? 'Add Stock' : 'Remove Stock'}
            </h3>
            
            <form onSubmit={handleStockAdjustment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockAdjustment.quantity}
                  onChange={(e) => setStockAdjustment(prev => ({
                    ...prev,
                    quantity: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={stockAdjustment.reason}
                  onChange={(e) => setStockAdjustment(prev => ({
                    ...prev,
                    reason: e.target.value
                  }))}
                  placeholder="e.g., Damaged goods, New shipment, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowStockModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-md ${
                    stockAdjustment.type === 'in' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {stockAdjustment.type === 'in' ? 'Add Stock' : 'Remove Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showAddProduct && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... (rest of the form remains the same) ... */}
          </form>
        </div>
      )}

      {/* Products List */}
      {!showAddProduct && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || stockFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || stockFilter !== 'all' ? (
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.primary_image || '/api/placeholder/40/40'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category_name}</div>
                          {product.seller_id !== user?.id && (
                            <div className="text-xs text-red-500 font-semibold">Not your product!</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        product.quantity > 10 ? 'text-green-600' : 
                        product.quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {product.quantity}
                        {product.quantity > 0 && product.quantity <= 10 && (
                          <span className="text-xs text-yellow-500 ml-1">(Low)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.is_published ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openStockModal(product, 'in')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Stock In
                      </button>
                      <button
                        onClick={() => openStockModal(product, 'out')}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Stock Out
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
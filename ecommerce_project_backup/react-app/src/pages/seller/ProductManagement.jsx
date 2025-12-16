// src/pages/seller/ProductManagement.jsx
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching seller products...');
      
      const response = await productsAPI.getSellerProducts();
      console.log('Seller products response:', response.data);
      
      if (response.data.success === false) {
        throw new Error(response.data.message);
      }
      
      setProducts(response.data.products || []);
      console.log(`Loaded ${response.data.products?.length || 0} products for current seller`);
      
    } catch (error) {
      console.error('Error fetching seller products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

const getProductImageUrl = (imagePath) => {
  if (!imagePath) return '/api/placeholder/40/40';
  
  // If it's already a full URL, use it as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it starts with /uploads, construct the full URL
  if (imagePath.startsWith('/uploads')) {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}${imagePath}`;
  }
  
  return imagePath;
};


  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || 
      product.category_id?.toString() === categoryFilter;

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && product.is_published) ||
      (statusFilter === 'draft' && !product.is_published);

    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'in_stock' && product.quantity > 0) ||
      (stockFilter === 'out_of_stock' && product.quantity <= 0) ||
      (stockFilter === 'low_stock' && product.quantity > 0 && product.quantity <= 10);

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(products.map(p => p.category_name).filter(Boolean))];

  // Check if product can be deleted (no orders)
  const canDeleteProduct = (product) => {
    // If the backend provides a has_orders flag, use it
    // Otherwise, we'll assume it can be deleted for backward compatibility
    return product.has_orders !== true;
  };

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setFormLoading(true);

  //   try {
  //     let response;
      
  //     if (editingProduct) {
  //       // Update existing product
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

  //       console.log('Updating product:', editingProduct.id);
  //       response = await productsAPI.updateProduct(editingProduct.id, productData);
  //       toast.success('Product updated successfully');
  //     } else {
  //       // Create new product with FormData
  //       const productData = new FormData();
        
  //       // Append all form fields
  //       productData.append('name', formData.name);
  //       productData.append('description', formData.description);
  //       productData.append('price', parseFloat(formData.price) || 0);
        
  //       if (formData.compare_price) {
  //         productData.append('compare_price', parseFloat(formData.compare_price));
  //       }
  //       if (formData.cost_per_item) {
  //         productData.append('cost_per_item', parseFloat(formData.cost_per_item));
  //       }
  //       if (formData.category_id) {
  //         productData.append('category_id', parseInt(formData.category_id));
  //       }
        
  //       productData.append('sku', formData.sku || '');
  //       productData.append('barcode', formData.barcode || '');
  //       productData.append('quantity', parseInt(formData.quantity) || 0);
  //       productData.append('track_quantity', formData.track_quantity ? '1' : '0');
  //       productData.append('is_published', formData.is_published ? '1' : '0');
  //       productData.append('is_featured', formData.is_featured ? '1' : '0');
  //       productData.append('requires_shipping', formData.requires_shipping ? '1' : '0');
        
  //       if (formData.weight) {
  //         productData.append('weight', parseFloat(formData.weight));
  //       }
        
  //       productData.append('seo_title', formData.seo_title || '');
  //       productData.append('seo_description', formData.seo_description || '');

  //       // Append images
  //       if (selectedFiles.length > 0) {
  //         selectedFiles.forEach(file => {
  //           productData.append('images', file);
  //         });
  //       }

  //       console.log('Creating new product...');
  //       response = await productsAPI.createProduct(productData);
  //       toast.success('Product added successfully');
  //     }

  //     setShowAddProduct(false);
  //     setEditingProduct(null);
  //     resetForm();
  //     fetchProducts();
      
  //   } catch (error) {
  //     console.error('Error saving product:', error);
      
  //     let errorMessage = 'Failed to save product';
      
  //     if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.response?.status === 403) {
  //       errorMessage = 'You do not have permission to update this product';
  //     } else if (error.response?.status === 404) {
  //       errorMessage = 'Product not found';
  //     } else if (error.response?.status === 401) {
  //       errorMessage = 'Please log in again';
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('user');
  //       window.location.href = '/login';
  //     }
      
  //     toast.error(errorMessage);
  //   } finally {
  //     setFormLoading(false);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  setFormLoading(true);

  try {
    // Use FormData for BOTH create and update
    const productData = new FormData();
    
    // Append all form fields
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', parseFloat(formData.price) || 0);
    
    if (formData.compare_price) {
      productData.append('compare_price', parseFloat(formData.compare_price));
    }
    if (formData.cost_per_item) {
      productData.append('cost_per_item', parseFloat(formData.cost_per_item));
    }
    if (formData.category_id) {
      productData.append('category_id', parseInt(formData.category_id));
    }
    
    productData.append('sku', formData.sku || '');
    productData.append('barcode', formData.barcode || '');
    productData.append('quantity', parseInt(formData.quantity) || 0);
    productData.append('track_quantity', formData.track_quantity ? '1' : '0');
    productData.append('is_published', formData.is_published ? '1' : '0');
    productData.append('is_featured', formData.is_featured ? '1' : '0');
    productData.append('requires_shipping', formData.requires_shipping ? '1' : '0');
    
    if (formData.weight) {
      productData.append('weight', parseFloat(formData.weight));
    }
    
    productData.append('seo_title', formData.seo_title || '');
    productData.append('seo_description', formData.seo_description || '');

    // Append images for BOTH create and update
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        productData.append('images', file);
      });
    }

    let response;
    if (editingProduct) {
      console.log('Updating product with FormData:', editingProduct.id);
      response = await productsAPI.updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully');
    } else {
      console.log('Creating new product...');
      response = await productsAPI.createProduct(productData);
      toast.success('Product added successfully');
    }

    setShowAddProduct(false);
    setEditingProduct(null);
    resetForm();
    fetchProducts();
    
  } catch (error) {
    console.error('Error saving product:', error);
    
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

  // const handleEdit = (product) => {
  //   console.log('Editing product:', product);
    
  //   // Check if current user owns this product
  //   if (product.seller_id !== user?.id && user?.role !== 'admin') {
  //     toast.error('You do not have permission to edit this product');
  //     return;
  //   }
    
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
const handleEdit = (product) => {
  console.log('Editing product:', product);
  
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
  
  // **FIX: Show existing product images as previews**
  if (product.primary_image) {
    console.log('Setting image preview for existing product:', product.primary_image);
    // Use the existing image URL directly since it should already be formatted
    setImagePreviews([product.primary_image]);
  } else {
    console.log('No existing image found for product');
    setImagePreviews([]);
  }
  
  setSelectedFiles([]);
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
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }
  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowAddProduct(true);
          }}
          className="bg-primary-600 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button
              onClick={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare Price
                </label>
                <input
                  type="number"
                  name="compare_price"
                  value={formData.compare_price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Per Item
                </label>
                <input
                  type="number"
                  name="cost_per_item"
                  value={formData.cost_per_item}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreviews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="track_quantity"
                  checked={formData.track_quantity}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Track Quantity</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Published</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requires_shipping"
                  checked={formData.requires_shipping}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Requires Shipping</span>
              </label>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2 bg-primary-600 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {formLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
              </button>
            </div>
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
                  className="bg-primary-600 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-primary-600 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center mx-auto"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {/* <img
                              className="h-10 w-10 rounded object-cover"
                              src={product.primary_image || '/api/placeholder/40/40'}
                              alt={product.name}
                            /> */}

                            <img
  className="h-10 w-10 rounded object-cover"
  src={getProductImageUrl(product.primary_image)}
  alt={product.name}
  onError={(e) => {
    e.target.src = '/api/placeholder/40/40';
  }}
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
                        {/* Only show delete button if product has no orders */}
                        {canDeleteProduct(product) && (
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                        {/* Show disabled delete button with tooltip if product has orders */}
                        {!canDeleteProduct(product) && (
                          <button
                            disabled
                            className="text-gray-400 cursor-not-allowed"
                            title="Cannot delete product with existing orders"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
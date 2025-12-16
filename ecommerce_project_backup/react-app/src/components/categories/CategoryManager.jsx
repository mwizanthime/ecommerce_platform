
// src/components/Categories/CategoryManager.jsx
import React, { useState, useEffect } from 'react';
import { categoriesAPI, sellerCategoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';

const CategoryManager = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  const [showForm, setShowForm] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '',
    image_url: ''
  });

  console.log('Current user:', user);
  console.log('User role:', user?.role);
  
  useEffect(() => {
    if (user.role === 'admin') {
      fetchCategories();
      if (activeTab === 'suggestions') {
        fetchAdminSuggestions();
      }
    } else if (user.role === 'seller') {
      fetchCategories();
      fetchSellerSuggestions();
    }
  }, [activeTab, user.role]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getCategories();
      
      let categoriesData = response.data;
      if (categoriesData && Array.isArray(categoriesData.categories)) {
        setCategories(categoriesData.categories);
      } else if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else if (categoriesData && Array.isArray(categoriesData.data)) {
        setCategories(categoriesData.data);
      } else {
        console.warn('Unexpected categories response structure:', categoriesData);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.response?.status !== 403) {
        toast.error('Failed to load categories');
      }
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if category or any of its subcategories contain products
  const hasProducts = (category) => {
    // Check if the category itself has products
    if (category.product_count > 0) {
      return true;
    }
    
    // Check if any subcategory has products
    if (category.subcategories && Array.isArray(category.subcategories)) {
      return category.subcategories.some(subcategory => 
        subcategory.product_count > 0
      );
    }
    
    return false;
  };

  // Find category by ID (including subcategories)
  const findCategoryById = (categoryId, categoriesList = categories) => {
    for (const category of categoriesList) {
      if (category.id === categoryId) {
        return category;
      }
      
      // Check subcategories
      if (category.subcategories && Array.isArray(category.subcategories)) {
        const foundInSubcategories = findCategoryById(categoryId, category.subcategories);
        if (foundInSubcategories) {
          return foundInSubcategories;
        }
      }
    }
    return null;
  };

  const handleDelete = async (categoryId) => {
    // Find the category to check if it has products
    const categoryToDelete = findCategoryById(categoryId);
    
    if (!categoryToDelete) {
      toast.error('Category not found');
      return;
    }

    // Check if category or any subcategories contain products
    if (hasProducts(categoryToDelete)) {
      toast.error('Cannot delete category: It contains products. Please remove all products first.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await categoriesAPI.deleteCategory(categoryId);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        toast.error('Cannot delete category: It contains products or is being used.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  // Separate function for admin to get ALL suggestions
  const fetchAdminSuggestions = async () => {
    try {
      console.log('Fetching admin suggestions...');
      
      let response;
      // Try admin-specific endpoint first
      try {
        response = await sellerCategoryAPI.getAdminCategorySuggestions('pending');
        console.log('Admin suggestions response:', response);
      } catch (adminError) {
        console.log('Admin endpoint failed, trying fallback:', adminError);
        // Fallback: use regular endpoint with status filter
        response = await sellerCategoryAPI.getCategorySuggestions('pending');
      }
      
      let suggestionsData = response.data;
      
      // Handle the response structure from backend
      if (suggestionsData && suggestionsData.success && Array.isArray(suggestionsData.suggestions)) {
        setSuggestions(suggestionsData.suggestions);
      } else if (Array.isArray(suggestionsData)) {
        setSuggestions(suggestionsData);
      } else {
        console.warn('Unexpected admin suggestions response structure:', suggestionsData);
        setSuggestions([]);
      }

      console.log(`Admin loaded ${suggestionsData.suggestions?.length || suggestionsData.length || 0} suggestions`);
      
    } catch (error) {
      console.error('Error fetching admin suggestions:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // For development, use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development');
        const mockAdminSuggestions = [
          {
            id: 1,
            name: 'Smart Home Devices',
            description: 'IoT and smart home automation products',
            status: 'pending',
            suggested_by_name: 'Seller John',
            created_at: new Date().toISOString(),
            parent_name: 'Electronics'
          },
          {
            id: 2,
            name: 'Fitness Equipment',
            description: 'Home workout and fitness gear',
            status: 'pending', 
            suggested_by_name: 'Seller Jane',
            created_at: new Date().toISOString(),
            parent_name: 'Sports'
          }
        ];
        setSuggestions(mockAdminSuggestions);
      } else {
        if (error.response?.status !== 403) {
          toast.error('Failed to load suggestions');
        }
        setSuggestions([]);
      }
    }
  };

  // Separate function for sellers to get their own suggestions
  const fetchSellerSuggestions = async () => {
    try {
      const response = await sellerCategoryAPI.getCategorySuggestions();
      
      let suggestionsData = response.data;
      if (suggestionsData && suggestionsData.success && Array.isArray(suggestionsData.suggestions)) {
        setSuggestions(suggestionsData.suggestions);
      } else if (Array.isArray(suggestionsData)) {
        setSuggestions(suggestionsData);
      } else {
        console.warn('Unexpected seller suggestions response structure:', suggestionsData);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching seller suggestions:', error);
      if (error.response?.status === 403) {
        console.log('Seller not authorized to view suggestions');
      } else {
        toast.error('Failed to load suggestions');
      }
      setSuggestions([]);
    }
  };

  // Add safe array check for categories
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent_id: category.parent_id || '',
      image_url: category.image_url || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoriesAPI.createCategory(formData);
        toast.success('Category created successfully');
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', parent_id: '', image_url: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sellerCategoryAPI.suggestCategory(formData);
      toast.success(response.data?.message || 'Category suggestion submitted successfully! It will be reviewed by an administrator.');
      setShowSuggestionForm(false);
      setFormData({ name: '', description: '', parent_id: '', image_url: '' });
      if (user.role === 'seller') {
        fetchSellerSuggestions();
      } else {
        fetchAdminSuggestions();
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast.error(error.response?.data?.message || 'Failed to submit suggestion');
    }
  };

  const handleSuggestionAction = async (suggestionId, action, notes = '') => {
    try {
      const response = await sellerCategoryAPI.updateSuggestionStatus(suggestionId, {
        status: action,
        admin_notes: notes
      });
      toast.success(response.data?.message || `Suggestion ${action} successfully`);
      if (user.role === 'admin') {
        fetchAdminSuggestions();
      } else {
        fetchSellerSuggestions();
      }
      if (action === 'approved') {
        fetchCategories();
      }
    } catch (error) {
      console.error(`Error ${action} suggestion:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} suggestion`);
    }
  };

  const handleDeleteSuggestion = async (suggestionId) => {
    if (!window.confirm('Are you sure you want to delete this suggestion?')) {
      return;
    }

    try {
      const response = await sellerCategoryAPI.deleteSuggestion(suggestionId);
      toast.success(response.data?.message || 'Suggestion deleted successfully');
      if (user.role === 'admin') {
        fetchAdminSuggestions();
      } else {
        fetchSellerSuggestions();
      }
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      toast.error(error.response?.data?.message || 'Failed to delete suggestion');
    }
  };

  // Render different content based on user role
  if (user.role === 'seller') {
    return <SellerCategoryView 
      suggestions={safeSuggestions}
      loading={loading}
      onSuggestionSubmit={handleSuggestionSubmit}
      onDeleteSuggestion={handleDeleteSuggestion}
      showSuggestionForm={showSuggestionForm}
      setShowSuggestionForm={setShowSuggestionForm}
      formData={formData}
      setFormData={setFormData}
      categories={safeCategories}
    />;
  }

  // Admin view with safe arrays
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-2">Manage product categories and review seller suggestions</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories ({safeCategories.length})
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'suggestions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Suggestions ({safeSuggestions.filter(s => s.status === 'pending').length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'categories' && (
          <AdminCategoriesView
            categories={safeCategories}
            loading={loading}
            onShowForm={() => {
              setEditingCategory(null);
              setFormData({ name: '', description: '', parent_id: '', image_url: '' });
              setShowForm(true);
            }}
            onEditCategory={handleEdit}
            onDeleteCategory={handleDelete}
            showForm={showForm}
            onCloseForm={() => setShowForm(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            editingCategory={editingCategory}
            hasProducts={hasProducts}
          />
        )}

        {activeTab === 'suggestions' && (
          <SuggestionsView
            suggestions={safeSuggestions}
            onSuggestionAction={handleSuggestionAction}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

// Sub-components for better organization
const SellerCategoryView = ({ 
  suggestions, 
  loading, 
  onSuggestionSubmit, 
  onDeleteSuggestion,
  showSuggestionForm,
  setShowSuggestionForm,
  formData,
  setFormData,
  categories 
}) => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Category Suggestions</h1>
        <p className="text-gray-600 mt-2">Suggest new categories for the platform</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowSuggestionForm(true)}
          className="bg-primary-500 text-gray-700 border border-gray-300  px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Suggest New Category
        </button>
      </div>

      {/* Suggestion Form Modal */}
      {showSuggestionForm && (
        <CategorySuggestionForm
          onSubmit={onSuggestionSubmit}
          onClose={() => setShowSuggestionForm(false)}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
        />
      )}

      {/* Suggestions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Suggestions</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner />
          </div>
        ) : suggestions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No suggestions yet. Suggest your first category!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{suggestion.name}</h3>
                    {suggestion.description && (
                      <p className="text-gray-600 mt-1">{suggestion.description}</p>
                    )}
                    {suggestion.parent_name && (
                      <p className="text-sm text-gray-500 mt-1">
                        Parent Category: {suggestion.parent_name}
                      </p>
                    )}
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                      <span>Submitted: {new Date(suggestion.created_at).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        suggestion.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {suggestion.status}
                      </span>
                    </div>
                    {suggestion.admin_notes && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Admin Notes:</strong> {suggestion.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                  {suggestion.status === 'pending' && (
                    <button
                      onClick={() => onDeleteSuggestion(suggestion.id)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const AdminCategoriesView = ({
  categories,
  loading,
  onShowForm,
  onEditCategory,
  onDeleteCategory,
  showForm,
  onCloseForm,
  onSubmit,
  formData,
  setFormData,
  editingCategory,
  hasProducts
}) => (
  <div>
    {/* Add Category Button */}
    <div className="mb-6">
      <button
        onClick={onShowForm}
        className="bg-primary-500 text-gray-700 border border-gray-300  px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
      >
        Add New Category
      </button>
    </div>

    {/* Category Form Modal */}
    {showForm && (
      <CategoryForm
        onSubmit={onSubmit}
        onClose={onCloseForm}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        editingCategory={editingCategory}
      />
    )}

    {/* Categories List */}
    {loading ? (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    ) : (
      <CategoryList
        categories={categories}
        onEdit={onEditCategory}
        onDelete={onDeleteCategory}
        hasProducts={hasProducts}
      />
    )}
  </div>
);

const SuggestionsView = ({ suggestions, onSuggestionAction, loading }) => {
  const [actionNotes, setActionNotes] = useState({});
  const [activeAction, setActiveAction] = useState(null);

  const handleActionWithNotes = (suggestionId, action) => {
    if (action === 'rejected') {
      setActiveAction({ suggestionId, action });
    } else {
      onSuggestionAction(suggestionId, action);
    }
  };

  const submitActionWithNotes = () => {
    if (activeAction) {
      onSuggestionAction(activeAction.suggestionId, activeAction.action, actionNotes[activeAction.suggestionId] || '');
      setActiveAction(null);
      setActionNotes(prev => ({ ...prev, [activeAction.suggestionId]: '' }));
    }
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : pendingSuggestions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No pending suggestions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{suggestion.name}</h3>
                  {suggestion.description && (
                    <p className="text-gray-600 mt-1">{suggestion.description}</p>
                  )}
                  {suggestion.parent_name && (
                    <p className="text-sm text-gray-500 mt-1">
                      Suggested as subcategory of: {suggestion.parent_name}
                    </p>
                  )}
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                    <span>Suggested by: {suggestion.suggested_by_name}</span>
                    <span>Submitted: {new Date(suggestion.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleActionWithNotes(suggestion.id, 'approved')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleActionWithNotes(suggestion.id, 'rejected')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Notes input for rejection */}
              {activeAction?.suggestionId === suggestion.id && activeAction.action === 'rejected' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for rejection (optional):
                  </label>
                  <textarea
                    value={actionNotes[suggestion.id] || ''}
                    onChange={(e) => setActionNotes(prev => ({
                      ...prev,
                      [suggestion.id]: e.target.value
                    }))}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Provide feedback to the seller..."
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setActiveAction(null)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitActionWithNotes}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable Form Components
const CategoryForm = ({ onSubmit, onClose, formData, setFormData, categories, editingCategory }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {editingCategory ? 'Edit Category' : 'Add New Category'}
      </h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category
          </label>
          <select
            value={formData.parent_id}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">No Parent (Top Level)</option>
            {categories.filter(cat => !cat.parent_id).map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-gray-700 border border-gray-300  rounded-lg hover:bg-gray-300 transition-colors"
          >
            {editingCategory ? 'Update' : 'Create'} Category
          </button>
        </div>
      </form>
    </div>
  </div>
);

const CategorySuggestionForm = ({ onSubmit, onClose, formData, setFormData, categories }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Suggest New Category</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
            placeholder="Enter a descriptive category name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
            placeholder="Describe what products would fit in this category..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category (Optional)
          </label>
          <select
            value={formData.parent_id}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">No Parent (Top Level Category)</option>
            {categories.filter(cat => !cat.parent_id).map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your suggestion will be reviewed by an administrator before being added to the platform.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-gray-700 border border-gray-300  rounded-lg hover:bg-gray-300 transition-colors"
          >
            Submit Suggestion
          </button>
        </div>
      </form>
    </div>
  </div>
);

const CategoryList = ({ categories, onEdit, onDelete, hasProducts }) => {
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  if (safeCategories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No categories found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeCategories.map((category) => (
              <React.Fragment key={category.id}>
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category.image_url && (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={category.product_count > 0 ? "font-medium text-gray-600" : ""}>
                      {category.product_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.parent_id ? 
                      safeCategories.find(cat => cat.id === category.parent_id)?.name || 'N/A' 
                      : 'Top Level'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(category)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(category.id)}
                      className={`${
                        hasProducts(category) 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600 hover:text-red-900'
                      }`}
                      disabled={hasProducts(category)}
                      title={hasProducts(category) ? "Cannot delete category with products" : "Delete category"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {/* Subcategories - with safe array check */}
                {category.subcategories && Array.isArray(category.subcategories) && 
                 category.subcategories.map((subcategory) => (
                  <tr key={subcategory.id} className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center ml-8">
                        {subcategory.image_url && (
                          <img
                            src={subcategory.image_url}
                            alt={subcategory.name}
                            className="w-6 h-6 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-700">
                            ↳ {subcategory.name}
                          </div>
                          {subcategory.description && (
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {subcategory.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={subcategory.product_count > 0 ? "font-medium text-gray-600" : ""}>
                        {subcategory.product_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onEdit(subcategory)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(subcategory.id)}
                        className={`${
                          subcategory.product_count > 0 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        disabled={subcategory.product_count > 0}
                        title={subcategory.product_count > 0 ? "Cannot delete subcategory with products" : "Delete subcategory"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager;
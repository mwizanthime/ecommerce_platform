import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { paymentAPI } from '../services/api';

const TransactionHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Status configurations
  const statusConfig = {
    completed: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '✅',
      label: 'Completed'
    },
    processing: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🔄',
      label: 'Processing'
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '⏳',
      label: 'Pending'
    },
    failed: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '❌',
      label: 'Failed'
    },
    cancelled: {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '🚫',
      label: 'Cancelled'
    }
  };

  // Provider icons
  const providerIcons = {
    momo: '📱',
    airtel_money: '💳',
    mpesa: '💰',
    orange_money: '🍊',
    tigo_pesa: '🐯',
    vodacom_mpesa: '📶'
  };

  const providerNames = {
    momo: 'MTN Mobile Money',
    airtel_money: 'Airtel Money',
    mpesa: 'M-Pesa',
    orange_money: 'Orange Money',
    tigo_pesa: 'Tigo Pesa',
    vodacom_mpesa: 'Vodacom M-Pesa'
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // const fetchTransactions = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await paymentAPI.getTransactionHistory();
  //     setTransactions(response.data.transactions || []);
  //   } catch (error) {
  //     console.error('Error fetching transactions:', error);
  //     toast.error('Failed to load transaction history');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Filter transactions
  
  
  
  // In your TransactionHistory.jsx fetchTransactions function
const fetchTransactions = async () => {
  try {
    setLoading(true);
    const response = await paymentAPI.getTransactionHistory();
    console.log('Transactions response:', response.data);
    setTransactions(response.data.transactions || []);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    console.error('Error details:', error.response?.data);
    toast.error(`Failed to load transaction history: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoading(false);
  }
};
  
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  }).filter(transaction => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.merchantReference.toLowerCase().includes(searchLower) ||
      transaction.phoneNumber.toLowerCase().includes(searchLower) ||
      providerNames[transaction.provider]?.toLowerCase().includes(searchLower)
    );
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format amount
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
            <p className="text-gray-600">View all your payment transactions</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/send-money')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              New Payment
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <button
              onClick={fetchTransactions}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Transactions Found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'No transactions match your search criteria'
                : 'You haven\'t made any payments yet'}
            </p>
            {searchTerm || filter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate('/send-money')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Make Your First Payment
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Left side */}
                    <div className="mb-4 lg:mb-0 lg:flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">
                          {providerIcons[transaction.provider] || '💸'}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {providerNames[transaction.provider] || transaction.provider}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Phone Number</p>
                          <p className="font-medium text-gray-900">{transaction.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Reference</p>
                          <p className="font-mono text-xs text-gray-900">
                            {transaction.merchantReference}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side */}
                    <div className="flex flex-col items-start lg:items-end space-y-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${formatAmount(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.currency}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          statusConfig[transaction.status]?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className="mr-1">
                            {statusConfig[transaction.status]?.icon || '❓'}
                          </span>
                          {statusConfig[transaction.status]?.label || transaction.status}
                        </span>
                        
                        <button
                          onClick={() => navigate(`/transactions/${transaction.id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
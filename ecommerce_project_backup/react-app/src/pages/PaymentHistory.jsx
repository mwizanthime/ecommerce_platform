import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { paymentAPI } from '../services/api';

const PaymentHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'order', 'standalone'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const params = { type: filter === 'all' ? 'all' : filter };
        if (statusFilter !== 'all') params.status = statusFilter;
        
        const response = await paymentAPI.getPaymentHistory(params);
        setPayments(response.data.payments || []);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [filter, statusFilter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  const getProviderIcon = (provider) => {
    const icons = {
      momo: '📱',
      airtel_money: '💳',
      mpesa: '💰',
      orange_money: '🍊',
      tigo_pesa: '🐯',
      vodacom_mpesa: '📶'
    };
    return icons[provider] || '💸';
  };

  const getProviderName = (provider) => {
    const names = {
      momo: 'MTN Mobile Money',
      airtel_money: 'Airtel Money',
      mpesa: 'M-Pesa',
      orange_money: 'Orange Money',
      tigo_pesa: 'Tigo Pesa',
      vodacom_mpesa: 'Vodacom M-Pesa'
    };
    return names[provider] || provider;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDetails = (payment) => {
    if (payment.type === 'order_payment' && payment.order) {
      navigate(`/orders/${payment.order.orderId}`);
    } else {
      navigate(`/payments/${payment.id}`);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.merchantReference?.toLowerCase().includes(searchLower) ||
      payment.phoneNumber?.toLowerCase().includes(searchLower) ||
      (payment.order?.orderNumber?.toLowerCase().includes(searchLower)) ||
      payment.provider?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600">View all your payments in one place</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Payments</option>
                <option value="order">Order Payments</option>
                <option value="standalone">Standalone Payments</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 pl-10 w-full md:w-64"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">💸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-600">You haven't made any payments yet.</p>
            <button
              onClick={() => navigate('/send-money')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Send Money
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getProviderIcon(payment.provider)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {getProviderName(payment.provider)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {payment.type === 'order_payment' ? 'Order Payment' : 'Money Transfer'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Phone: {payment.phoneNumber}</p>
                        <p>Date: {formatDate(payment.createdAt)}</p>
                        {payment.order && (
                          <p>Order: #{payment.order.orderNumber}</p>
                        )}
                        <p className="font-mono text-xs">Ref: {payment.merchantReference}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${formatAmount(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-600">{payment.currency}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                        
                        <button
                          onClick={() => handleViewDetails(payment)}
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

export default PaymentHistory;
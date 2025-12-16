import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { paymentAPI } from '../services/api';

const TransactionStatus = () => {
  const { transactionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Initial transaction data from navigation state
  const initialTransaction = location.state?.transaction;
  const instructions = location.state?.instructions || [];

  // Get status color and icon
  const getStatusConfig = (status) => {
    const config = {
      completed: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '✅',
        label: 'Completed',
        message: 'Payment completed successfully'
      },
      processing: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '🔄',
        label: 'Processing',
        message: 'Payment is being processed'
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '⏳',
        label: 'Pending',
        message: 'Waiting for payment confirmation'
      },
      failed: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '❌',
        label: 'Failed',
        message: 'Payment failed'
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '🚫',
        label: 'Cancelled',
        message: 'Payment was cancelled'
      }
    };
    return config[status] || config.pending;
  };

  // Fetch transaction details
  const fetchTransaction = async () => {
    try {
      const response = await paymentAPI.checkTransactionStatus(transactionId);
      setTransaction(response.data.transaction);
      
      // Stop polling if transaction is completed/failed/cancelled
      if (['completed', 'failed', 'cancelled'].includes(response.data.transaction.status)) {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to load transaction details');
    } finally {
      setLoading(false);
      setCheckingStatus(false);
    }
  };

  // Check status manually
  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    await fetchTransaction();
  };

  // Initialize with data from navigation state
  useEffect(() => {
    if (initialTransaction) {
      setTransaction(initialTransaction);
      setLoading(false);
    }
  }, [initialTransaction]);

  // Fetch transaction details on mount
  useEffect(() => {
    if (!initialTransaction) {
      fetchTransaction();
    }

    // Set up polling for pending/processing transactions
    const interval = setInterval(() => {
      if (transaction && ['pending', 'processing'].includes(transaction.status)) {
        fetchTransaction();
      }
    }, 10000); // Poll every 10 seconds

    setPollingInterval(interval);

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [transactionId]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format amount
  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  // Get provider icon and name
  const getProviderInfo = (provider) => {
    const providers = {
      momo: { icon: '📱', name: 'MTN Mobile Money' },
      airtel_money: { icon: '💳', name: 'Airtel Money' },
      mpesa: { icon: '💰', name: 'M-Pesa' },
      orange_money: { icon: '🍊', name: 'Orange Money' },
      tigo_pesa: { icon: '🐯', name: 'Tigo Pesa' },
      vodacom_mpesa: { icon: '📶', name: 'Vodacom M-Pesa' }
    };
    return providers[provider] || { icon: '💸', name: provider };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction Not Found</h2>
          <p className="text-gray-600 mb-6">The transaction you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/send-money')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Payment
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transaction.status);
  const providerInfo = getProviderInfo(transaction.provider);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate('/send-money')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <span className="mr-2">←</span>
            Back to Send Money
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Transaction Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              {/* Status Banner */}
              <div className={`mb-6 p-4 rounded-xl border ${statusConfig.color}`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{statusConfig.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{statusConfig.label}</h3>
                    <p className="text-sm mt-1">{statusConfig.message}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Transaction Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Transaction ID</label>
                        <p className="font-mono text-gray-900">{transaction.id}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Reference</label>
                        <p className="font-mono text-sm text-gray-900">{transaction.merchantReference}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Date & Time</label>
                        <p className="text-gray-900">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Payment Method</label>
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{providerInfo.icon}</span>
                          <span className="text-gray-900">{providerInfo.name}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Phone Number</label>
                        <p className="text-gray-900">{transaction.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">PawaPay Transaction ID</label>
                        <p className="font-mono text-sm text-gray-900">
                          {transaction.transactionId || 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-3xl font-bold text-gray-900">
                        ${formatAmount(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{transaction.currency}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                        <span className="mr-1">{statusConfig.icon}</span>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {['pending', 'processing'].includes(transaction.status) && (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleCheckStatus}
                      disabled={checkingStatus}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center"
                    >
                      {checkingStatus ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Checking...</span>
                        </>
                      ) : (
                        'Check Status Now'
                      )}
                    </button>
                    <button
                      onClick={() => navigate('/send-money')}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Send Another Payment
                    </button>
                  </div>
                )}

                {['completed', 'failed', 'cancelled'].includes(transaction.status) && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/send-money')}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Send New Payment
                    </button>
                    <button
                      onClick={() => navigate('/transactions')}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                    >
                      View All Transactions
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            {instructions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">Next Steps</h3>
                <ul className="space-y-3">
                  {instructions.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Help & Timeline */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Payment Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Payment Initiated</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Request Sent</p>
                    <p className="text-sm text-gray-600">
                      Payment request sent to {transaction.phoneNumber}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    transaction.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className={transaction.status === 'completed' ? 'text-green-600' : 'text-gray-600'}>
                      3
                    </span>
                  </div>
                  <div>
                    <p className={`font-medium ${
                      transaction.status === 'completed' ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      Payment Confirmed
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.status === 'completed' 
                        ? `Completed at ${formatDate(transaction.updatedAt)}`
                        : 'Waiting for confirmation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">❓</span>
                Need Help?
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>
                  <strong>Payment not received?</strong> It may take a few minutes to process.
                </li>
                <li>
                  <strong>Wrong phone number?</strong> Contact support immediately.
                </li>
                <li>
                  <strong>Transaction stuck?</strong> Check your mobile money app.
                </li>
              </ul>
              <button className="w-full mt-4 bg-white text-blue-600 py-2 rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors font-medium">
                Contact Support
              </button>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">About {providerInfo.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {providerInfo.name} is a mobile money service that allows you to send and receive money using your mobile phone.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-mono text-xs">{transaction.merchantReference}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
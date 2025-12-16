import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { paymentAPI } from '../services/api';

const StandalonePayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [country, setCountry] = useState('RW');
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Country options
  const countries = [
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' }
  ];

  // Phone number prefixes by country
  const phonePrefixes = {
    RW: '+250',
    KE: '+254',
    UG: '+256',
    TZ: '+255',
    GH: '+233'
  };

  // Load supported providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoadingProviders(true);
        const response = await paymentAPI.getSupportedProviders(country);
        setProviders(response.data.providers || []);
        
        // Auto-select first provider if available
        if (response.data.providers.length > 0 && !selectedProvider) {
          setSelectedProvider(response.data.providers[0].id);
        }
      } catch (error) {
        console.error('Failed to load providers:', error);
        toast.error('Failed to load payment providers');
      } finally {
        setLoadingProviders(false);
      }
    };

    loadProviders();
  }, [country]);

  // Load recent transactions
  useEffect(() => {
    const loadRecentTransactions = async () => {
      if (!user) return;
      
      try {
        const response = await paymentAPI.getTransactionHistory();
        setRecentTransactions(response.data.transactions.slice(0, 5) || []);
      } catch (error) {
        console.error('Failed to load recent transactions:', error);
      }
    };

    loadRecentTransactions();
  }, [user]);

  // Format amount
  const formatAmount = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Handle phone number input
  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
    
    // Remove all non-numeric characters except +
    value = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with the correct prefix
    const prefix = phonePrefixes[country];
    if (!value.startsWith(prefix)) {
      value = prefix;
    }
    
    setPhoneNumber(value);
  };

  // Validate form
  const validateForm = () => {
    if (!selectedProvider) {
      toast.error('Please select a payment provider');
      return false;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return false;
    }

    // Provider-specific validation
    const selectedProviderInfo = providers.find(p => p.id === selectedProvider);
    if (selectedProviderInfo) {
      if (amountNum < selectedProviderInfo.minAmount) {
        toast.error(`Minimum amount is $${selectedProviderInfo.minAmount}`);
        return false;
      }
      if (amountNum > selectedProviderInfo.maxAmount) {
        toast.error(`Maximum amount is $${selectedProviderInfo.maxAmount}`);
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to make a payment');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        provider: selectedProvider,
        phoneNumber: phoneNumber,
        amount: parseFloat(amount),
        country: country
      };

      console.log('💳 Initiating standalone payment:', paymentData);

      const response = await paymentAPI.initiateStandalonePayment(paymentData);
      
      if (response.data.success) {
        toast.success('Payment initiated successfully!');
        
        // Navigate to transaction status page
        navigate(`/transactions/${response.data.transaction.transactionId}`, {
          state: {
            transaction: response.data.transaction,
            instructions: response.data.nextSteps
          }
        });
      } else {
        throw new Error(response.data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle country change
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    
    // Update phone number prefix
    const prefix = phonePrefixes[newCountry];
    if (!phoneNumber.startsWith(prefix)) {
      setPhoneNumber(prefix);
    }
    
    // Clear selected provider as it might not be available in new country
    setSelectedProvider('');
  };

  // Get provider icon
  const getProviderIcon = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.icon || '💸';
  };

  // Get provider name
  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.name || providerId;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
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

  if (loadingProviders) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Send Money
          </h1>
          <p className="text-gray-600">
            Send money instantly via mobile money
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <form onSubmit={handleSubmit}>
                {/* Country Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">🌍</span>
                      Country
                    </span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {countries.map((countryOption) => (
                      <button
                        key={countryOption.code}
                        type="button"
                        onClick={() => {
                          setCountry(countryOption.code);
                          const prefix = phonePrefixes[countryOption.code];
                          if (!phoneNumber.startsWith(prefix)) {
                            setPhoneNumber(prefix);
                          }
                          setSelectedProvider('');
                        }}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          country === countryOption.code
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <span className="text-lg mr-2">{countryOption.flag}</span>
                          <span className="text-sm font-medium">{countryOption.code}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Provider Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  {providers.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No payment methods available for this country
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {providers.map((provider) => (
                        <div
                          key={provider.id}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            selectedProvider === provider.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedProvider(provider.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{provider.icon}</span>
                            <div className="text-left">
                              <p className="font-semibold text-gray-800">{provider.name}</p>
                              <p className="text-xs text-gray-600">
                                ${provider.minAmount} - ${provider.maxAmount}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">📱</span>
                      Phone Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Enter phone number"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    You will receive a payment request on this number
                  </p>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <span className="mr-2">💰</span>
                      Amount (USD)
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.01"
                      min="0.1"
                      max="10000"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="0.00"
                    />
                  </div>
                  {selectedProvider && providers.find(p => p.id === selectedProvider) && (
                    <p className="text-sm text-gray-500 mt-2">
                      Amount range: ${providers.find(p => p.id === selectedProvider).minAmount} - $
                      {providers.find(p => p.id === selectedProvider).maxAmount}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !selectedProvider || providers.length === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    `Send $${formatAmount(amount)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Recent Transactions & Info */}
          <div className="space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Transactions
              </h2>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-4xl mb-2">💸</div>
                  <p>No recent transactions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span>{getProviderIcon(transaction.provider)}</span>
                            <span className="font-medium text-gray-800">
                              {getProviderName(transaction.provider)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {transaction.phoneNumber}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${formatAmount(transaction.amount)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {recentTransactions.length > 0 && (
                <button
                  onClick={() => navigate('/transactions')}
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Transactions →
                </button>
              )}
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">ℹ️</span>
                How it works
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Select your country and payment method</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Enter the recipient's phone number</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Enter the amount to send</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Confirm and check your phone for payment request</span>
                </li>
              </ul>
            </div>

            {/* Supported Providers */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Supported Providers
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>📱</span>
                    <span className="text-sm">MTN Mobile Money</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Rwanda, Ghana
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>💳</span>
                    <span className="text-sm">Airtel Money</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Rwanda, Uganda
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>💰</span>
                    <span className="text-sm">M-Pesa</span>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Kenya
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>🍊</span>
                    <span className="text-sm">Orange Money</span>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Uganda
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandalonePayment;
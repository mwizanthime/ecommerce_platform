// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import LoadingSpinner from '../Common/LoadingSpinner';
// import toast from 'react-hot-toast';
// import { paymentAPI } from '../../services/api';

// const PaymentModal = ({ 
//   isOpen, 
//   onClose, 
//   type = 'standalone_payment', 
//   order = null,
//   defaultAmount = '',
//   defaultPhone = ''
// }) => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [loadingProviders, setLoadingProviders] = useState(true);
//   const [providers, setProviders] = useState([]);
//   const [selectedProvider, setSelectedProvider] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState(defaultPhone || '');
//   const [amount, setAmount] = useState(defaultAmount || '');
//   const [country, setCountry] = useState('RW');
//   const [description, setDescription] = useState('');

//   // Country options
//   const countries = [
//     { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
//     { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
//     { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
//     { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
//     { code: 'GH', name: 'Ghana', flag: '🇬🇭' }
//   ];

//   // Phone number prefixes
//   const phonePrefixes = {
//     RW: '+250',
//     KE: '+254',
//     UG: '+256',
//     TZ: '+255',
//     GH: '+233'
//   };

//   // Load supported providers
//   useEffect(() => {
//     const loadProviders = async () => {
//       try {
//         setLoadingProviders(true);
//         const response = await paymentAPI.getSupportedPaymentMethods(country, type);
//         setProviders(response.data.providers || []);
        
//         if (response.data.providers.length > 0 && !selectedProvider) {
//           setSelectedProvider(response.data.providers[0].id);
//         }
//       } catch (error) {
//         console.error('Failed to load providers:', error);
//         toast.error('Failed to load payment providers');
//       } finally {
//         setLoadingProviders(false);
//       }
//     };

//     if (isOpen) {
//       loadProviders();
      
//       // Pre-fill form based on type
//       if (type === 'order_payment' && order) {
//         setAmount(order.total_amount || '');
//         setDescription(`Payment for order ${order.order_number}`);
        
//         // Try to get phone from order shipping address
//         if (order.shipping_address && order.shipping_address.phone) {
//           setPhoneNumber(order.shipping_address.phone);
//         }
//       }
//     }
//   }, [isOpen, country, type, order]);

//   // Reset form on close
//   useEffect(() => {
//     if (!isOpen) {
//       setPhoneNumber(defaultPhone || '');
//       setAmount(defaultAmount || '');
//       setSelectedProvider('');
//       setDescription('');
//     }
//   }, [isOpen, defaultPhone, defaultAmount]);

//   const handlePhoneNumberChange = (e) => {
//     let value = e.target.value;
//     value = value.replace(/[^\d+]/g, '');
    
//     const prefix = phonePrefixes[country];
//     if (!value.startsWith(prefix)) {
//       value = prefix;
//     }
    
//     setPhoneNumber(value);
//   };

//   const handleCountryChange = (e) => {
//     const newCountry = e.target.value;
//     setCountry(newCountry);
    
//     const prefix = phonePrefixes[newCountry];
//     if (!phoneNumber.startsWith(prefix)) {
//       setPhoneNumber(prefix);
//     }
    
//     setSelectedProvider('');
//   };

//   const validateForm = () => {
//     if (!selectedProvider) {
//       toast.error('Please select a payment provider');
//       return false;
//     }

//     if (!phoneNumber || phoneNumber.length < 10) {
//       toast.error('Please enter a valid phone number');
//       return false;
//     }

//     if (type === 'standalone_payment') {
//       const amountNum = parseFloat(amount);
//       if (isNaN(amountNum) || amountNum <= 0) {
//         toast.error('Please enter a valid amount greater than 0');
//         return false;
//       }

//       const selectedProviderInfo = providers.find(p => p.id === selectedProvider);
//       if (selectedProviderInfo) {
//         if (amountNum < selectedProviderInfo.minAmount) {
//           toast.error(`Minimum amount is $${selectedProviderInfo.minAmount}`);
//           return false;
//         }
//         if (amountNum > selectedProviderInfo.maxAmount) {
//           toast.error(`Maximum amount is $${selectedProviderInfo.maxAmount}`);
//           return false;
//         }
//       }
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast.error('Please login to make a payment');
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const paymentData = {
//         type: type,
//         provider: selectedProvider,
//         phoneNumber: phoneNumber,
//         country: country,
//         description: description
//       };

//       // Add type-specific data
//       if (type === 'order_payment' && order) {
//         paymentData.orderId = order.id;
//       } else {
//         paymentData.amount = parseFloat(amount);
//       }

//       console.log('💳 Initiating payment:', paymentData);

//       const response = await paymentAPI.initiatePayment(paymentData);
      
//       if (response.data.success) {
//         toast.success('Payment initiated successfully!');
        
//         // Close modal
//         onClose();
        
//         // Redirect based on payment type
//         if (type === 'order_payment') {
//           window.location.href = `/orders/${order.id}`;
//         } else {
//           window.location.href = `/payments/${response.data.payment.paymentId}`;
//         }
//       } else {
//         throw new Error(response.data.message || 'Failed to initiate payment');
//       }
//     } catch (error) {
//       console.error('Payment initiation error:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">
//               {type === 'order_payment' ? 'Pay for Order' : 'Send Money'}
//             </h2>
//             {type === 'order_payment' && order && (
//               <p className="text-sm text-gray-600 mt-1">Order #{order.order_number}</p>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6">
//           {/* Country Selection */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Country
//             </label>
//             <div className="flex space-x-2 overflow-x-auto pb-2">
//               {countries.map((countryOption) => (
//                 <button
//                   key={countryOption.code}
//                   type="button"
//                   onClick={() => {
//                     setCountry(countryOption.code);
//                     const prefix = phonePrefixes[countryOption.code];
//                     if (!phoneNumber.startsWith(prefix)) {
//                       setPhoneNumber(prefix);
//                     }
//                     setSelectedProvider('');
//                   }}
//                   className={`px-3 py-2 rounded-lg border flex-shrink-0 ${
//                     country === countryOption.code
//                       ? 'bg-blue-50 border-blue-500 text-blue-700'
//                       : 'border-gray-300 hover:border-gray-400'
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <span className="text-lg mr-2">{countryOption.flag}</span>
//                     <span className="text-sm">{countryOption.code}</span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Provider Selection */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Payment Method
//             </label>
//             {loadingProviders ? (
//               <LoadingSpinner size="sm" />
//             ) : providers.length === 0 ? (
//               <div className="text-center py-4 text-gray-500">
//                 No payment methods available for this country
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 gap-2">
//                 {providers.map((provider) => (
//                   <div
//                     key={provider.id}
//                     className={`border rounded-lg p-3 cursor-pointer transition-all ${
//                       selectedProvider === provider.id
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-300 hover:border-gray-400'
//                     }`}
//                     onClick={() => setSelectedProvider(provider.id)}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <span className="text-xl">{provider.icon}</span>
//                       <span className="text-sm font-medium">{provider.name}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Phone Number */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={phoneNumber}
//               onChange={handlePhoneNumberChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter phone number"
//               required
//             />
//           </div>

//           {/* Amount (for standalone payments) */}
//           {type === 'standalone_payment' && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Amount (USD)
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
//                 <input
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   step="0.01"
//                   min="0.1"
//                   className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="0.00"
//                   required
//                 />
//               </div>
//             </div>
//           )}

//           {/* Description (for standalone payments) */}
//           {type === 'standalone_payment' && (
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description (Optional)
//               </label>
//               <input
//                 type="text"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="What is this payment for?"
//               />
//             </div>
//           )}

//           {/* Order Info (for order payments) */}
//           {type === 'order_payment' && order && (
//             <div className="mb-6 p-3 bg-gray-50 rounded-lg">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Order Total:</span>
//                 <span className="font-bold text-lg">${order.total_amount}</span>
//               </div>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || loadingProviders || providers.length === 0}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {loading ? (
//               <>
//                 <LoadingSpinner size="sm" />
//                 <span className="ml-2">Processing...</span>
//               </>
//             ) : (
//               type === 'order_payment' ? `Pay $${order?.total_amount || '0.00'}` : `Send $${amount || '0.00'}`
//             )}
//           </button>

//           <p className="text-xs text-gray-500 text-center mt-3">
//             You will receive a payment request on your phone
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PaymentModal;




// React component - PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { paymentAPI } from '../../services/api';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  type = 'standalone_payment', 
  order = null,
  defaultAmount = '',
  defaultPhone = '',
  onPaymentSuccess = () => {}
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone || '');
  const [amount, setAmount] = useState(defaultAmount || '');
  const [country, setCountry] = useState('RW');
  const [description, setDescription] = useState('');

  // Country options
  const countries = [
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' }
  ];

  // Phone number prefixes
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
        const response = await paymentAPI.getSupportedPaymentMethods(country, type);
        
        if (response.data.success) {
          setProviders(response.data.providers || []);
          
          if (response.data.providers.length > 0 && !selectedProvider) {
            setSelectedProvider(response.data.providers[0].id);
          }
        } else {
          toast.error(response.data.message || 'Failed to load providers');
        }
      } catch (error) {
        console.error('Failed to load providers:', error);
        toast.error('Failed to load payment providers');
      } finally {
        setLoadingProviders(false);
      }
    };

    if (isOpen) {
      loadProviders();
      
      // Pre-fill form based on type
      if (type === 'order_payment' && order) {
        setAmount(order.total_amount || '');
        setDescription(`Payment for order ${order.order_number}`);
        
        // Try to get phone from order shipping address
        if (order.shipping_address && order.shipping_address.phone) {
          setPhoneNumber(order.shipping_address.phone);
        } else if (order.phoneNumber) {
          setPhoneNumber(order.phoneNumber);
        }
        
        // Set country based on order
        if (order.shipping_address && order.shipping_address.country) {
          const countryCode = Object.keys(countries).find(
            key => countries[key].name === order.shipping_address.country
          );
          if (countryCode) setCountry(countryCode);
        }
      }
    }
  }, [isOpen, country, type, order]);

  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setPhoneNumber(defaultPhone || '');
      setAmount(defaultAmount || '');
      setSelectedProvider('');
      setDescription('');
      setCountry('RW');
    }
  }, [isOpen, defaultPhone, defaultAmount]);

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d+]/g, '');
    
    const prefix = phonePrefixes[country];
    if (!value.startsWith(prefix)) {
      value = prefix;
    }
    
    setPhoneNumber(value);
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    
    const prefix = phonePrefixes[newCountry];
    if (!phoneNumber.startsWith(prefix)) {
      setPhoneNumber(prefix);
    }
    
    setSelectedProvider('');
    setLoadingProviders(true);
  };

  const validateForm = () => {
    if (!selectedProvider) {
      toast.error('Please select a payment provider');
      return false;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    if (type === 'standalone_payment') {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        toast.error('Please enter a valid amount greater than 0');
        return false;
      }

      const selectedProviderInfo = providers.find(p => p.id === selectedProvider);
      if (selectedProviderInfo) {
        if (amountNum < selectedProviderInfo.minAmount) {
          toast.error(`Minimum amount is ${selectedProviderInfo.minAmount} ${selectedProviderInfo.currency}`);
          return false;
        }
        if (amountNum > selectedProviderInfo.maxAmount) {
          toast.error(`Maximum amount is ${selectedProviderInfo.maxAmount} ${selectedProviderInfo.currency}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to make a payment');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        type: type,
        provider: selectedProvider,
        phoneNumber: phoneNumber,
        country: country,
        description: description
      };

      // Add type-specific data
      if (type === 'order_payment' && order) {
        paymentData.orderId = order.id;
      } else {
        paymentData.amount = parseFloat(amount);
      }

      console.log('💳 Initiating payment:', paymentData);

      const response = await paymentAPI.initiatePayment(paymentData);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Payment initiated successfully!');
        
        // Call success callback
        onPaymentSuccess(response.data);
        
        // Close modal after a delay
        setTimeout(() => {
          onClose();
        }, 1500);
        
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {type === 'order_payment' ? 'Pay for Order' : 'Send Money'}
            </h2>
            {type === 'order_payment' && order && (
              <p className="text-sm text-gray-600 mt-1">Order #{order.order_number}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Country Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <div className="flex space-x-2 overflow-x-auto pb-2">
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
                  className={`px-3 py-2 rounded-lg border flex-shrink-0 ${
                    country === countryOption.code
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{countryOption.flag}</span>
                    <span className="text-sm">{countryOption.code}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Provider Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            {loadingProviders ? (
              <div className="text-center py-4">
                <LoadingSpinner size="sm" />
                <p className="text-sm text-gray-500 mt-2">Loading payment methods...</p>
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                <p>No payment methods available for {country}</p>
                <p className="text-sm mt-1">Try selecting a different country</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedProvider === provider.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{provider.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{provider.name}</span>
                        <p className="text-xs text-gray-500 mt-1">{provider.correspondent}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You will receive a payment request on this number
            </p>
          </div>

          {/* Amount (for standalone payments) */}
          {type === 'standalone_payment' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {providers.find(p => p.id === selectedProvider)?.currency === 'USD' ? '$' : ''}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0.1"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          )}

          {/* Description (for standalone payments) */}
          {type === 'standalone_payment' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What is this payment for?"
              />
            </div>
          )}

          {/* Order Info (for order payments) */}
          {type === 'order_payment' && order && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-bold text-lg">
                  {providers.find(p => p.id === selectedProvider)?.currency === 'USD' ? '$' : ''}
                  {order.total_amount}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || loadingProviders || providers.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              type === 'order_payment' 
                ? `Pay ${order?.total_amount || '0.00'} ${providers.find(p => p.id === selectedProvider)?.currency || ''}`
                : `Send ${amount || '0.00'} ${providers.find(p => p.id === selectedProvider)?.currency || ''}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            You will receive a payment request on your phone
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
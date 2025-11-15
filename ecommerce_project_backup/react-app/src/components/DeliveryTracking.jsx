// src/components/DeliveryTracking.jsx
import React, { useState, useEffect } from 'react';
import { deliveryAPI } from '../services/api';
import toast from 'react-hot-toast';

const DeliveryTracking = ({ order, user }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [deliveryProofs, setDeliveryProofs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  useEffect(() => {
    if (order) {
      fetchTrackingInfo();
      fetchDeliveryProofs();
    }
  }, [order]);

  const fetchTrackingInfo = async () => {
    try {
      const response = await deliveryAPI.getTrackingInfo(order.id);
      setTrackingInfo(response.data);
    } catch (error) {
      console.error('Error fetching tracking info:', error);
    }
  };

  const fetchDeliveryProofs = async () => {
    try {
      const response = await deliveryAPI.getDeliveryProofs(order.id);
      setDeliveryProofs(response.data.proofs);
    } catch (error) {
      console.error('Error fetching delivery proofs:', error);
    }
  };

  const handleOTPVerification = async () => {
    try {
      setLoading(true);
      await deliveryAPI.verifyDeliveryWithOTP(order.id, { 
        otp, 
        deliveryPersonId: user.id 
      });
      toast.success('Delivery verified successfully!');
      setShowOTPVerification(false);
      setOtp('');
      fetchTrackingInfo();
      fetchDeliveryProofs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify delivery');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('proofFile', file);
      formData.append('proofType', 'photo');
      formData.append('notes', 'Delivery completed with photo proof');

      await deliveryAPI.uploadDeliveryProof(order.id, formData);
      toast.success('Delivery proof uploaded successfully!');
      setShowPhotoUpload(false);
      fetchTrackingInfo();
      fetchDeliveryProofs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload proof');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      picked_up: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Order Placed', description: 'Order confirmed and awaiting processing' },
      { status: 'picked_up', label: 'Picked Up', description: 'Package picked up by carrier' },
      { status: 'in_transit', label: 'In Transit', description: 'Package is on the way' },
      { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Package is with delivery personnel' },
      { status: 'delivered', label: 'Delivered', description: 'Package successfully delivered' }
    ];

    const currentStatusIndex = steps.findIndex(step => step.status === trackingInfo?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStatusIndex,
      current: index === currentStatusIndex
    }));
  };

  if (!trackingInfo) {
    return <div>Loading tracking information...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Tracking</h3>
      
      {/* Tracking Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700">Tracking Number</h4>
          <p className="text-lg">{trackingInfo.tracking_number}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700">Carrier</h4>
          <p className="text-lg capitalize">{trackingInfo.carrier}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700">Current Status</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingInfo.status)}`}>
            {trackingInfo.status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Delivery Progress</h4>
        <div className="relative">
          {getStatusSteps().map((step, index) => (
            <div key={step.status} className="flex items-start mb-6">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step.completed ? '✓' : index + 1}
              </div>
              <div className="ml-4 flex-1">
                <p className={`font-medium ${step.current ? 'text-green-600' : 'text-gray-600'}`}>
                  {step.label}
                </p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              {index < getStatusSteps().length - 1 && (
                <div className={`absolute left-4 top-8 w-0.5 h-12 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`} style={{ marginLeft: '14px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Proofs */}
      {deliveryProofs.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-4">Delivery Proofs</h4>
          <div className="space-y-3">
            {deliveryProofs.map((proof, index) => (
              <div key={proof.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium capitalize">{proof.proof_type} Verification</p>
                    <p className="text-sm text-gray-600">
                      Verified by: {proof.verified_by_name || 'System'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(proof.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Verified
                  </span>
                </div>
                
                {proof.proof_type === 'photo' && proof.proof_data.fileUrl && (
                  <div className="mt-3">
                    <img 
                      src={proof.proof_data.fileUrl} 
                      alt="Delivery proof" 
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}

                {proof.proof_type === 'otp' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      OTP verified at: {new Date(proof.verified_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Actions */}
      {(user.role === 'delivery' || user.role === 'admin') && trackingInfo.status !== 'delivered' && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-700 mb-3">Delivery Actions</h4>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowOTPVerification(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Verify with OTP
            </button>
            <button
              onClick={() => setShowPhotoUpload(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Upload Photo Proof
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Verify Delivery with OTP</h3>
            <p className="text-gray-600 mb-4">
              Enter the OTP provided by the customer to verify delivery.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              maxLength={6}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowOTPVerification(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleOTPVerification}
                disabled={loading || otp.length !== 6}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Upload Delivery Proof Photo</h3>
            <p className="text-gray-600 mb-4">
              Take a photo of the delivered package at the customer's location.
            </p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handlePhotoUpload(e.target.files[0]);
                }
              }}
              className="w-full mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPhotoUpload(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;
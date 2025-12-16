// src/pages/OrderPaymentStatus.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderPaymentStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Order Payment Status</h1>
          <p className="mb-4">This page handles payment status for order {orderId}.</p>
          <button
            onClick={() => navigate(`/orders/${orderId}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentStatus;
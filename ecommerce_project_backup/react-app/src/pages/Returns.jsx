// src/pages/Returns.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Returns = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-500 text-white py-6 px-6">
            <h1 className="text-3xl font-bold">Return Policy</h1>
            <p className="text-green-100 mt-2">Hassle-free returns within 30 days</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Return Policy Summary */}
            <section className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">30-Day Money Back Guarantee</h2>
                  <p className="text-green-700">We stand behind our products with a full 30-day return policy.</p>
                </div>
              </div>
            </section>

            {/* Return Conditions */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Return Conditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Eligible for Return
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Items within 30 days of delivery</li>
                    <li>• Unused products in original packaging</li>
                    <li>• Defective or damaged items</li>
                    <li>• Wrong items received</li>
                    <li>• All tags and labels attached</li>
                  </ul>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Not Eligible for Return
                  </h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Used or worn items</li>
                    <li>• Products without original packaging</li>
                    <li>• Personalized or custom items</li>
                    <li>• Digital products and downloads</li>
                    <li>• Final sale items</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Return Process */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Return an Item</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">1. Initiate Return</h3>
                    <p className="text-gray-600 mt-1">
                      Log into your account, go to your orders, and select "Return Item" for the product you wish to return.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">2. Print Shipping Label</h3>
                    <p className="text-gray-600 mt-1">
                      We'll email you a prepaid return shipping label. Print it and attach it to your package.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">3. Package & Ship</h3>
                    <p className="text-gray-600 mt-1">
                      Pack the item securely in its original packaging and drop it off at any shipping location.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">4. Receive Refund</h3>
                    <p className="text-gray-600 mt-1">
                      Once we receive and inspect your return, we'll process your refund within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refund Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Refund Method</h3>
                    <p className="text-gray-600">Refunds are issued to the original payment method. Credit card refunds may take 5-10 business days to appear on your statement.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">Shipping Costs</h3>
                    <p className="text-gray-600">Original shipping costs are non-refundable. Return shipping is free for defective or wrong items.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">Partial Refunds</h3>
                    <p className="text-gray-600">Items returned without original packaging or with missing components may be subject to a partial refund.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Return Questions?</h2>
              <p className="text-gray-600 mb-4">Our support team is ready to assist you with any return-related questions.</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Contact Returns Department
                </Link>
                <a
                  href="mailto:returns@shopeasy.com"
                  className="border border-blue-500 text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                >
                  Email: returns@shopeasy.com
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
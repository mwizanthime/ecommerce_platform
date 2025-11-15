// src/pages/ShippingInfo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-500 text-white py-6 px-6">
            <h1 className="text-3xl font-bold">Shipping Information</h1>
            <p className="text-primary-100 mt-2">Everything you need to know about our shipping policies</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Shipping Methods */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Methods & Delivery Times</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Standard Shipping</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 5-7 business days</li>
                    <li>• Free on orders over $50</li>
                    <li>• $4.99 for orders under $50</li>
                    <li>• Order tracking included</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Express Shipping</h3>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 2-3 business days</li>
                    <li>• $9.99 flat rate</li>
                    <li>• Priority processing</li>
                    <li>• Real-time tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Shipping Areas */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Areas</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-3">
                  We currently ship to all 50 US states. International shipping is not available at this time.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="bg-white p-2 rounded border">Continental US</div>
                  <div className="bg-white p-2 rounded border">Alaska</div>
                  <div className="bg-white p-2 rounded border">Hawaii</div>
                  <div className="bg-white p-2 rounded border">Puerto Rico</div>
                </div>
              </div>
            </section>

            {/* Order Processing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Processing</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Order Confirmation</h3>
                    <p className="text-gray-600">You'll receive an order confirmation email within 15 minutes of placing your order.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Order Processing</h3>
                    <p className="text-gray-600">Orders are processed within 24-48 hours during business days (Monday-Friday).</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Shipping</h3>
                    <p className="text-gray-600">Once shipped, you'll receive a tracking number to monitor your package.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Do you ship on weekends?</h3>
                  <p className="text-gray-600">We process and ship orders Monday through Friday. Orders placed on weekends will be processed the next business day.</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Can I change my shipping address after ordering?</h3>
                  <p className="text-gray-600">Address changes can only be made within 1 hour of placing your order. Contact our support team immediately if you need to change your address.</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">What if my package is lost or damaged?</h3>
                  <p className="text-gray-600">Contact us within 30 days of shipment for lost packages. For damaged items, please contact us immediately with photos of the damage.</p>
                </div>
              </div>
            </section>

            {/* Contact Support */}
            <section className="bg-primary-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Need Help with Shipping?</h2>
              <p className="text-gray-600 mb-4">Our customer service team is here to help with any shipping questions.</p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Contact Support
                </Link>
                <a
                  href="tel:+15551234567"
                  className="border border-primary-500 text-primary-500 px-6 py-2 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                >
                  Call: (555) 123-4567
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
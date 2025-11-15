// src/pages/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-500 text-white py-6 px-6">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-purple-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                At ShopEasy, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
                and use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Name and contact details (email address, phone number)</li>
                    <li>Shipping and billing addresses</li>
                    <li>Payment information (processed securely through our payment partners)</li>
                    <li>Account credentials (username and encrypted password)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Browsing behavior and usage patterns</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Purchase history and order details</li>
                    <li>Product preferences and wishlist items</li>
                    <li>Customer service interactions</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Order Processing</h3>
                  <p className="text-gray-600">Process your orders, payments, and deliveries</p>
                </div>
                <div className="border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Customer Service</h3>
                  <p className="text-gray-600">Provide support and handle inquiries</p>
                </div>
                <div className="border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Personalization</h3>
                  <p className="text-gray-600">Customize your shopping experience</p>
                </div>
                <div className="border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Marketing</h3>
                  <p className="text-gray-600">Send promotional offers (with your consent)</p>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li><strong>Service Providers:</strong> Payment processors, shipping carriers, and IT service providers</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing through PCI-compliant partners</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Access and Correction</h3>
                    <p className="text-gray-600">You can access and update your personal information in your account settings.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Data Deletion</h3>
                    <p className="text-gray-600">You can request deletion of your personal information, subject to legal requirements.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Marketing Preferences</h3>
                    <p className="text-gray-600">You can opt-out of marketing communications at any time through your account settings or by clicking unsubscribe in emails.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                and personalize content. You can control cookie preferences through your browser settings.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Types of Cookies We Use:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Advertising Cookies:</strong> Deliver relevant advertisements</li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>Email: privacy@shopeasy.com</p>
                <p>Phone: (555) 123-4567</p>
                <p>Address: 123 Commerce Street, City, State 12345</p>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Policy Updates</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
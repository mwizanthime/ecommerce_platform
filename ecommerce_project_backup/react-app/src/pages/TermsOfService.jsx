// src/pages/TermsOfService.jsx
import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-500 text-white py-6 px-6">
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-orange-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using ShopEasy ("the Website"), you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by these terms, please do not use this site.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Account Registration</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  To access certain features of the Website, you may be required to register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>
              </div>
            </section>

            {/* Products and Pricing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Products and Pricing</h2>
              <div className="space-y-4 text-gray-600">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">Product Information</h3>
                  <p>
                    We strive to display accurate product information, including descriptions, images, and prices. 
                    However, we do not guarantee that product descriptions or other content is accurate, complete, 
                    reliable, current, or error-free.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">Pricing</h3>
                  <p>
                    All prices are shown in US Dollars and are subject to change without notice. We reserve the right 
                    to modify or discontinue products at any time. In the event of a pricing error, we reserve the right 
                    to cancel any orders placed at the incorrect price.
                  </p>
                </div>
              </div>
            </section>

            {/* Orders and Payments */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Orders and Payments</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  By placing an order through our Website, you agree to the following terms:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All orders are subject to product availability</li>
                  <li>We reserve the right to refuse or cancel any order for any reason</li>
                  <li>You agree to provide current, complete, and accurate purchase information</li>
                  <li>You agree to pay all charges at the prices then in effect for your purchases</li>
                  <li>Sales tax will be added to orders as required by law</li>
                </ul>
              </div>
            </section>

            {/* Shipping and Delivery */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Shipping and Delivery</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Shipping times and costs are estimates only and may vary. We are not responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Delays caused by shipping carriers</li>
                  <li>Incorrect shipping addresses provided by customers</li>
                  <li>Customs delays for international shipments</li>
                  <li>Weather-related delays or force majeure events</li>
                </ul>
                <p>
                  Risk of loss and title for items purchased pass to you upon delivery to the shipping carrier.
                </p>
              </div>
            </section>

            {/* Returns and Refunds */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Returns and Refunds</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our return policy is detailed in our Returns page. By making a purchase, you agree to our return policy, which includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>30-day return window for most items</li>
                  <li>Items must be in original condition with packaging</li>
                  <li>Refunds will be issued to the original payment method</li>
                  <li>Shipping costs are non-refundable unless the return is due to our error</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Intellectual Property</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  All content included on this Website, such as text, graphics, logos, images, audio clips, digital 
                  downloads, and software, is the property of ShopEasy or its content suppliers and protected by 
                  international copyright laws.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2">Restrictions</h3>
                  <p>
                    You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, 
                    create derivative works from, transfer, or sell any information, software, products, or services 
                    obtained from this Website without our express written permission.
                  </p>
                </div>
              </div>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. User Conduct</h2>
              <div className="space-y-4 text-gray-600">
                <p>You agree not to use the Website to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Submit false or misleading information</li>
                  <li>Upload viruses or malicious code</li>
                  <li>Interfere with the security or functionality of the Website</li>
                  <li>Attempt to gain unauthorized access to any part of the Website</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Limitation of Liability</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  To the fullest extent permitted by applicable law, ShopEasy shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including without limitation, loss of 
                  profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Your access to or use of or inability to access or use the Website</li>
                  <li>Any conduct or content of any third party on the Website</li>
                  <li>Any content obtained from the Website</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Indemnification</h2>
              <p className="text-gray-600">
                You agree to defend, indemnify, and hold harmless ShopEasy and its affiliates, officers, directors, 
                employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, 
                costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your 
                violation of these Terms of Service or your use of the Website.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Termination</h2>
              <p className="text-gray-600">
                We may terminate or suspend your account and bar access to the Website immediately, without prior 
                notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
                including but not limited to a breach of the Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Governing Law</h2>
              <p className="text-gray-600">
                These Terms shall be governed and construed in accordance with the laws of the State of California, 
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
                revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. 
                What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p>Email: legal@shopeasy.com</p>
                <p>Phone: (555) 123-4567</p>
                <p>Address: 123 Commerce Street, City, State 12345</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
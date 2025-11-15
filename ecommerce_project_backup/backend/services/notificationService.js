// backend/services/notificationService.js

// Mock email service - replace with real service like SendGrid, Mailgun, etc.
export const sendEmail = async ({ to, subject, template, data }) => {
  try {
    console.log('📧 Mock Email Service:', {
      to,
      subject,
      template,
      data
    });
    
    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun  
    // - AWS SES
    // - Nodemailer
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
};

// Mock SMS service - replace with real service like Twilio, etc.
export const sendSMS = async ({ to, message }) => {
  try {
    console.log('📱 Mock SMS Service:', {
      to,
      message
    });
    
    // In a real application, you would integrate with an SMS service like:
    // - Twilio
    // - Plivo
    // - AWS SNS
    
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('SMS service error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  orderShipped: (data) => `
    <h2>Your Order Has Been Shipped!</h2>
    <p>Hello ${data.customerName},</p>
    <p>Your order #${data.orderNumber} has been shipped and is on its way!</p>
    <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
    <p><strong>Carrier:</strong> ${data.carrier}</p>
    <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
    <p><strong>Delivery OTP:</strong> ${data.otp}</p>
    <p>Please keep this OTP ready for delivery verification.</p>
  `,
  
  orderDelivered: (data) => `
    <h2>Your Order Has Been Delivered!</h2>
    <p>Hello,</p>
    <p>Your order #${data.orderNumber} has been successfully delivered.</p>
    <p><strong>Delivery Date:</strong> ${data.deliveryDate}</p>
    <p>Thank you for shopping with us!</p>
  `
};
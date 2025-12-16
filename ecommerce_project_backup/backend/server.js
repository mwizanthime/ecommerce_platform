// // backend/server.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Import routes
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// import productRoutes from './routes/products.js';
// import categoryRoutes from './routes/categories.js';
// import orderRoutes from './routes/orders.js';
// import reviewRoutes from './routes/reviews.js';
// import cartRoutes from './routes/cart.js';
// import wishlistRoutes from './routes/wishlist.js';
// import dashboardRoutes from './routes/dashboard.js';
// import couponRoutes from './routes/coupons.js';
// import uploadsRouter from './routes/uploads.js';
// import deliveryRoutes from './routes/delivery.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/coupons', couponRoutes);
// app.use('/api', uploadsRouter);
// app.use('/api/delivery', deliveryRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
  
//   // Multer errors
//   if (err.code === 'LIMIT_FILE_SIZE') {
//     return res.status(400).json({ message: 'File too large' });
//   }
  
//   if (err.message === 'Only image files are allowed') {
//     return res.status(400).json({ message: err.message });
//   }
  
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//    console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
// });

// backend/server.js - Update static file serving
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import dashboardRoutes from './routes/dashboard.js';
import couponRoutes from './routes/coupons.js';
import uploadsRouter from './routes/uploads.js';
import deliveryRoutes from './routes/delivery.js';
import analyticsRoutes from './routes/analytics.js';
import categorySuggestionsRoutes from './routes/categorySuggestions.js';
import paymentRoutes from './routes/payments.js';
import reportRoutes from './routes/reports.js';
import standalonePaymentsRouter from './routes/standalonePayments.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files from uploads directory (same as products)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api', uploadsRouter);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/analytics',analyticsRoutes);
app.use('/api/category-suggestions', categorySuggestionsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/standalone-payments', standalonePaymentsRouter);




// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: '🛒 E-commerce API is running!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'API Root',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      webhook: 'POST /api/payments/pawapay/webhook',
      test: 'GET /api/payments/test-webhook'
    }
  });
});


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    server: 'running',
    timestamp: new Date().toISOString()
  });
});



// PawaPay webhook endpoint
app.post('/api/payments/pawapay/webhook', (req, res) => {
  console.log('📦 PawaPay Webhook Received:', {
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  
  res.json({
    received: true,
    message: 'Webhook processed successfully',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for webhooks
app.get('/api/payments/test-webhook', (req, res) => {
  res.json({
    message: 'Webhook test endpoint is working!',
    instructions: 'Use POST /api/payments/pawapay/webhook for real webhooks',
    timestamp: new Date().toISOString()
  });
});






// Debug endpoint for profile pictures
app.get('/api/debug/profile-pictures', (req, res) => {
  const profilesPath = path.join(__dirname, 'uploads', 'profiles');
  
  try {
    if (!fs.existsSync(profilesPath)) {
      return res.json({
        status: 'error',
        message: 'Profile pictures directory does not exist',
        path: profilesPath
      });
    }
    
    const files = fs.readdirSync(profilesPath);
    
    res.json({
      status: 'success',
      message: 'Profile pictures directory is accessible',
      path: profilesPath,
      fileCount: files.length,
      files: files
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Error accessing profile pictures directory',
      error: error.message,
      path: profilesPath
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large' });
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  // res.status(404).json({ message: 'Route not found' });
res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /api',
      'GET /api/health',
      'POST /api/payments/pawapay/webhook',
      'GET /api/payments/test-webhook'
    ]
  });
});

const PORT = process.env.PORT || 5000;

// Ensure uploads directories exist on startup
function ensureDirectoriesExist() {
  const directories = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads', 'profiles')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

app.listen(PORT, () => {
  ensureDirectoriesExist();
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`Profile pictures served from: ${path.join(__dirname, 'uploads', 'profiles')}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
  console.log(`🔗 Ngrok: https://variolous-charles-previctorious.ngrok-free.dev`);
  console.log('\n📋 Test these endpoints:');
  console.log(`   curl https://variolous-charles-previctorious.ngrok-free.dev/`);
  console.log(`   curl https://variolous-charles-previctorious.ngrok-free.dev/api/health`);
  console.log(`   curl https://variolous-charles-previctorious.ngrok-free.dev/api/payments/test-webhook`);
});
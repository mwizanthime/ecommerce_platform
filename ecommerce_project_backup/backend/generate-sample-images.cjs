// // // generate-sample-images.js
// // const fs = require('fs');
// // const path = require('path');
// // const { createCanvas } = require('canvas');

// // // Create uploads directory if it doesn't exist
// // const uploadsDir = './uploads';
// // if (!fs.existsSync(uploadsDir)) {
// //   fs.mkdirSync(uploadsDir, { recursive: true });
// // }

// // // Product images configuration
// // const productImages = [
// //   { filename: 'iphone_15_pro.jpg', title: 'iPhone 15 Pro', category: 'Electronics', color: '#8B8B8B' },
// //   { filename: 'samsung_galaxy_s24.jpg', title: 'Samsung Galaxy S24', category: 'Electronics', color: '#1E3A8A' },
// //   { filename: 'google_pixel_8_pro.jpg', title: 'Google Pixel 8 Pro', category: 'Electronics', color: '#4285F4' },
// //   { filename: 'macbook_pro_16.jpg', title: 'MacBook Pro 16"', category: 'Electronics', color: '#000000' },
// //   { filename: 'dell_xps_15.jpg', title: 'Dell XPS 15', category: 'Electronics', color: '#0076CE' },
// //   { filename: 'lenovo_thinkpad.jpg', title: 'Lenovo ThinkPad', category: 'Electronics', color: '#E2231A' },
// //   { filename: 'mens_casual_shirt.jpg', title: 'Men\'s Casual Shirt', category: 'Clothing', color: '#1E40AF' },
// //   { filename: 'mens_jeans.jpg', title: 'Men\'s Jeans', category: 'Clothing', color: '#1E3A8A' },
// //   { filename: 'mens_running_shoes.jpg', title: 'Men\'s Running Shoes', category: 'Clothing', color: '#DC2626' },
// //   { filename: 'womens_summer_dress.jpg', title: 'Women\'s Summer Dress', category: 'Clothing', color: '#EC4899' },
// //   { filename: 'womens_handbag.jpg', title: 'Women\'s Handbag', category: 'Clothing', color: '#7C2D12' },
// //   { filename: 'womens_sneakers.jpg', title: 'Women\'s Sneakers', category: 'Clothing', color: '#FFFFFF' },
// //   { filename: 'coffee_machine.jpg', title: 'Coffee Machine', category: 'Home', color: '#6B7280' },
// //   { filename: 'air_fryer.jpg', title: 'Air Fryer', category: 'Home', color: '#374151' },
// //   { filename: 'bed_sheet_set.jpg', title: 'Bed Sheet Set', category: 'Home', color: '#FBBF24' },
// //   { filename: 'great_gatsby.jpg', title: 'The Great Gatsby', category: 'Books', color: '#B91C1C' },
// //   { filename: 'mockingbird.jpg', title: 'To Kill a Mockingbird', category: 'Books', color: '#78350F' },
// //   { filename: 'atomic_habits.jpg', title: 'Atomic Habits', category: 'Books', color: '#065F46' }
// // ];

// // // Category images configuration
// // const categoryImages = [
// //   { filename: 'electronics_category.jpg', title: 'Electronics', color: '#3B82F6' },
// //   { filename: 'clothing_category.jpg', title: 'Clothing', color: '#EF4444' },
// //   { filename: 'home_kitchen_category.jpg', title: 'Home & Kitchen', color: '#10B981' },
// //   { filename: 'books_category.jpg', title: 'Books', color: '#8B5CF6' }
// // ];

// // function createProductImage(imageConfig) {
// //   const width = 400;
// //   const height = 400;
// //   const canvas = createCanvas(width, height);
// //   const ctx = canvas.getContext('2d');

// //   // Background
// //   ctx.fillStyle = imageConfig.color;
// //   ctx.fillRect(0, 0, width, height);

// //   // Product silhouette (simplified)
// //   ctx.fillStyle = '#FFFFFF';
// //   ctx.globalAlpha = 0.8;
  
// //   // Different shapes for different categories
// //   if (imageConfig.category === 'Electronics') {
// //     // Rectangle for electronics
// //     ctx.fillRect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);
// //   } else if (imageConfig.category === 'Clothing') {
// //     // T-shape for clothing
// //     ctx.fillRect(width * 0.3, height * 0.2, width * 0.4, height * 0.5);
// //     ctx.fillRect(width * 0.2, height * 0.2, width * 0.6, height * 0.1);
// //   } else if (imageConfig.category === 'Home') {
// //     // Square for home items
// //     ctx.fillRect(width * 0.25, height * 0.25, width * 0.5, height * 0.5);
// //   } else {
// //     // Rectangle for books
// //     ctx.fillRect(width * 0.2, height * 0.3, width * 0.6, height * 0.4);
// //   }

// //   // Text
// //   ctx.globalAlpha = 1;
// //   ctx.fillStyle = '#FFFFFF';
// //   ctx.font = 'bold 20px Arial';
// //   ctx.textAlign = 'center';
// //   ctx.fillText(imageConfig.title, width / 2, height - 30);
  
// //   ctx.font = '14px Arial';
// //   ctx.fillText(imageConfig.category, width / 2, height - 10);

// //   // Save as JPEG
// //   const buffer = canvas.toBuffer('image/jpeg');
// //   fs.writeFileSync(path.join(uploadsDir, imageConfig.filename), buffer);
// //   console.log(`Created: ${imageConfig.filename}`);
// // }

// // function createCategoryImage(imageConfig) {
// //   const width = 600;
// //   const height = 400;
// //   const canvas = createCanvas(width, height);
// //   const ctx = canvas.getContext('2d');

// //   // Gradient background
// //   const gradient = ctx.createLinearGradient(0, 0, width, height);
// //   gradient.addColorStop(0, imageConfig.color);
// //   gradient.addColorStop(1, darkenColor(imageConfig.color, 0.3));
  
// //   ctx.fillStyle = gradient;
// //   ctx.fillRect(0, 0, width, height);

// //   // Title
// //   ctx.fillStyle = '#FFFFFF';
// //   ctx.font = 'bold 32px Arial';
// //   ctx.textAlign = 'center';
// //   ctx.fillText(imageConfig.title, width / 2, height / 2);

// //   ctx.font = '18px Arial';
// //   ctx.fillText('Category', width / 2, height / 2 + 40);

// //   // Save as JPEG
// //   const buffer = canvas.toBuffer('image/jpeg');
// //   fs.writeFileSync(path.join(uploadsDir, imageConfig.filename), buffer);
// //   console.log(`Created category: ${imageConfig.filename}`);
// // }

// // function darkenColor(color, factor) {
// //   // Simple color darkening for gradients
// //   const hex = color.replace('#', '');
// //   const num = parseInt(hex, 16);
// //   const amt = Math.round(2.55 * factor * 100);
// //   const R = (num >> 16) - amt;
// //   const G = (num >> 8 & 0x00FF) - amt;
// //   const B = (num & 0x0000FF) - amt;
// //   return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
// //                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
// //                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
// // }

// // // Generate all images
// // console.log('Generating product images...');
// // productImages.forEach(createProductImage);

// // console.log('Generating category images...');
// // categoryImages.forEach(createCategoryImage);

// // console.log('All sample images generated successfully!');


// // generate-sample-images.js
// const fs = require('fs');
// const path = require('path');

// // Create uploads directory if it doesn't exist
// const uploadsDir = './uploads';
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Simple SVG generator function
// function generateSVG(width, height, text, backgroundColor, textColor = '#FFFFFF') {
//   return `
//     <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
//       <rect width="100%" height="100%" fill="${backgroundColor}"/>
//       <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="${textColor}" text-anchor="middle" dy=".3em">${text}</text>
//     </svg>
//   `;
// }

// // Product images configuration
// const productImages = [
//   { filename: 'iphone_15_pro.jpg', title: 'iPhone 15 Pro', category: 'Electronics', color: '#8B8B8B' },
//   { filename: 'samsung_galaxy_s24.jpg', title: 'Samsung S24', category: 'Electronics', color: '#1E3A8A' },
//   { filename: 'google_pixel_8_pro.jpg', title: 'Pixel 8 Pro', category: 'Electronics', color: '#4285F4' },
//   { filename: 'macbook_pro_16.jpg', title: 'MacBook Pro', category: 'Electronics', color: '#000000' },
//   { filename: 'dell_xps_15.jpg', title: 'Dell XPS 15', category: 'Electronics', color: '#0076CE' },
//   { filename: 'lenovo_thinkpad.jpg', title: 'ThinkPad', category: 'Electronics', color: '#E2231A' },
//   { filename: 'mens_casual_shirt.jpg', title: 'Casual Shirt', category: 'Clothing', color: '#1E40AF' },
//   { filename: 'mens_jeans.jpg', title: 'Men Jeans', category: 'Clothing', color: '#1E3A8A' },
//   { filename: 'mens_running_shoes.jpg', title: 'Running Shoes', category: 'Clothing', color: '#DC2626' },
//   { filename: 'womens_summer_dress.jpg', title: 'Summer Dress', category: 'Clothing', color: '#EC4899' },
//   { filename: 'womens_handbag.jpg', title: 'Handbag', category: 'Clothing', color: '#7C2D12' },
//   { filename: 'womens_sneakers.jpg', title: 'Sneakers', category: 'Clothing', color: '#FFFFFF' },
//   { filename: 'coffee_machine.jpg', title: 'Coffee Machine', category: 'Home', color: '#6B7280' },
//   { filename: 'air_fryer.jpg', title: 'Air Fryer', category: 'Home', color: '#374151' },
//   { filename: 'bed_sheet_set.jpg', title: 'Bed Sheets', category: 'Home', color: '#FBBF24' },
//   { filename: 'great_gatsby.jpg', title: 'Great Gatsby', category: 'Books', color: '#B91C1C' },
//   { filename: 'mockingbird.jpg', title: 'Mockingbird', category: 'Books', color: '#78350F' },
//   { filename: 'atomic_habits.jpg', title: 'Atomic Habits', category: 'Books', color: '#065F46' }
// ];

// // Category images configuration
// const categoryImages = [
//   { filename: 'electronics_category.jpg', title: 'Electronics', color: '#3B82F6' },
//   { filename: 'clothing_category.jpg', title: 'Clothing', color: '#EF4444' },
//   { filename: 'home_kitchen_category.jpg', title: 'Home & Kitchen', color: '#10B981' },
//   { filename: 'books_category.jpg', title: 'Books', color: '#8B5CF6' },
//   { filename: 'smartphones_category.jpg', title: 'Smartphones', color: '#3B82F6' },
//   { filename: 'laptops_category.jpg', title: 'Laptops', color: '#6366F1' },
//   { filename: 'tablets_category.jpg', title: 'Tablets', color: '#8B5CF6' },
//   { filename: 'mens_clothing_category.jpg', title: 'Men Clothing', color: '#EF4444' },
//   { filename: 'womens_clothing_category.jpg', title: 'Women Clothing', color: '#EC4899' },
//   { filename: 'kitchen_appliances_category.jpg', title: 'Kitchen', color: '#10B981' },
//   { filename: 'home_decor_category.jpg', title: 'Home Decor', color: '#F59E0B' },
//   { filename: 'fiction_category.jpg', title: 'Fiction', color: '#B91C1C' },
//   { filename: 'non_fiction_category.jpg', title: 'Non-Fiction', color: '#78350F' }
// ];

// console.log('Generating product images...');
// productImages.forEach(config => {
//   const svgContent = generateSVG(400, 400, config.title, config.color);
//   const filePath = path.join(uploadsDir, config.filename.replace('.jpg', '.svg'));
//   fs.writeFileSync(filePath, svgContent);
//   console.log(`Created: ${filePath}`);
// });

// console.log('Generating category images...');
// categoryImages.forEach(config => {
//   const svgContent = generateSVG(600, 400, config.title, config.color);
//   const filePath = path.join(uploadsDir, config.filename.replace('.jpg', '.svg'));
//   fs.writeFileSync(filePath, svgContent);
//   console.log(`Created: ${filePath}`);
// });

// console.log('All sample images generated successfully as SVG files!');


// generate-sample-images.js
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Simple SVG generator function
function generateSVG(width, height, title, category, backgroundColor, textColor = '#FFFFFF') {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="16" fill="${textColor}" text-anchor="middle" font-weight="bold">${title}</text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="${textColor}" text-anchor="middle">${category}</text>
    </svg>
  `;
}

// Product images configuration
const productImages = [
  { filename: 'iphone_15_pro.svg', title: 'iPhone 15 Pro', category: 'Electronics', color: '#8B8B8B' },
  { filename: 'samsung_galaxy_s24.svg', title: 'Samsung S24', category: 'Electronics', color: '#1E3A8A' },
  { filename: 'google_pixel_8_pro.svg', title: 'Pixel 8 Pro', category: 'Electronics', color: '#4285F4' },
  { filename: 'macbook_pro_16.svg', title: 'MacBook Pro', category: 'Electronics', color: '#000000' },
  { filename: 'dell_xps_15.svg', title: 'Dell XPS 15', category: 'Electronics', color: '#0076CE' },
  { filename: 'lenovo_thinkpad.svg', title: 'ThinkPad', category: 'Electronics', color: '#E2231A' },
  { filename: 'ipad_pro.svg', title: 'iPad Pro', category: 'Electronics', color: '#5F5F5F' },
  { filename: 'samsung_galaxy_tab.svg', title: 'Galaxy Tab', category: 'Electronics', color: '#1428A0' },
  { filename: 'mens_casual_shirt.svg', title: 'Casual Shirt', category: 'Clothing', color: '#1E40AF' },
  { filename: 'mens_jeans.svg', title: 'Men Jeans', category: 'Clothing', color: '#1E3A8A' },
  { filename: 'mens_running_shoes.svg', title: 'Running Shoes', category: 'Clothing', color: '#DC2626' },
  { filename: 'womens_summer_dress.svg', title: 'Summer Dress', category: 'Clothing', color: '#EC4899' },
  { filename: 'womens_handbag.svg', title: 'Handbag', category: 'Clothing', color: '#7C2D12' },
  { filename: 'womens_sneakers.svg', title: 'Sneakers', category: 'Clothing', color: '#FFFFFF' },
  { filename: 'coffee_machine.svg', title: 'Coffee Machine', category: 'Home', color: '#6B7280' },
  { filename: 'air_fryer.svg', title: 'Air Fryer', category: 'Home', color: '#374151' },
  { filename: 'blender.svg', title: 'Blender', category: 'Home', color: '#4B5563' },
  { filename: 'bed_sheet_set.svg', title: 'Bed Sheets', category: 'Home', color: '#FBBF24' },
  { filename: 'wall_art.svg', title: 'Wall Art', category: 'Home', color: '#7C3AED' },
  { filename: 'table_lamp.svg', title: 'Table Lamp', category: 'Home', color: '#D97706' },
  { filename: 'great_gatsby.svg', title: 'Great Gatsby', category: 'Books', color: '#B91C1C' },
  { filename: 'mockingbird.svg', title: 'Mockingbird', category: 'Books', color: '#78350F' },
  { filename: '1984_book.svg', title: '1984', category: 'Books', color: '#475569' },
  { filename: 'atomic_habits.svg', title: 'Atomic Habits', category: 'Books', color: '#065F46' },
  { filename: 'sapiens_book.svg', title: 'Sapiens', category: 'Books', color: '#7C2D12' },
  { filename: 'psychology_money.svg', title: 'Money Psychology', category: 'Books', color: '#1E40AF' }
];

// Category images configuration
const categoryImages = [
  { filename: 'electronics_category.svg', title: 'Electronics', color: '#3B82F6' },
  { filename: 'clothing_category.svg', title: 'Clothing', color: '#EF4444' },
  { filename: 'home_kitchen_category.svg', title: 'Home & Kitchen', color: '#10B981' },
  { filename: 'books_category.svg', title: 'Books', color: '#8B5CF6' },
  { filename: 'smartphones_category.svg', title: 'Smartphones', color: '#3B82F6' },
  { filename: 'laptops_category.svg', title: 'Laptops', color: '#6366F1' },
  { filename: 'tablets_category.svg', title: 'Tablets', color: '#8B5CF6' },
  { filename: 'mens_clothing_category.svg', title: 'Men Clothing', color: '#EF4444' },
  { filename: 'womens_clothing_category.svg', title: 'Women Clothing', color: '#EC4899' },
  { filename: 'kitchen_appliances_category.svg', title: 'Kitchen', color: '#10B981' },
  { filename: 'home_decor_category.svg', title: 'Home Decor', color: '#F59E0B' },
  { filename: 'fiction_category.svg', title: 'Fiction', color: '#B91C1C' },
  { filename: 'non_fiction_category.svg', title: 'Non-Fiction', color: '#78350F' }
];

console.log('Generating product images...');
productImages.forEach(config => {
  const textColor = config.color === '#FFFFFF' ? '#000000' : '#FFFFFF';
  const svgContent = generateSVG(400, 400, config.title, config.category, config.color, textColor);
  const filePath = path.join(uploadsDir, config.filename);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created: ${filePath}`);
});

console.log('Generating category images...');
categoryImages.forEach(config => {
  const svgContent = generateSVG(600, 400, config.title, 'Category', config.color);
  const filePath = path.join(uploadsDir, config.filename);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created: ${filePath}`);
});

console.log('All sample images generated successfully as SVG files!');
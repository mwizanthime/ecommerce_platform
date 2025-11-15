// const { Sequelize } = require('sequelize');
// const config = require('../config/database');

// const sequelize = new Sequelize(config);

// const User = require('./user')(sequelize, Sequelize);
// const Product = require('./product')(sequelize, Sequelize);
// const Supplier = require('./supplier')(sequelize, Sequelize);
// const InventoryTransaction = require('./inventoryTransaction')(sequelize, Sequelize);

// // Define associations
// Product.belongsTo(Supplier, { foreignKey: 'supplier_id' });
// Supplier.hasMany(Product, { foreignKey: 'supplier_id' });

// InventoryTransaction.belongsTo(Product, { foreignKey: 'product_id' });
// Product.hasMany(InventoryTransaction, { foreignKey: 'product_id' });

// InventoryTransaction.belongsTo(User, { foreignKey: 'user_id' });
// User.hasMany(InventoryTransaction, { foreignKey: 'user_id' });

// module.exports = {
//   sequelize,
//   User,
//   Product,
//   Supplier,
//   InventoryTransaction
// };



const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

// Import model definitions
const User = require('./user')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);
const Supplier = require('./supplier')(sequelize, DataTypes);
const InventoryTransaction = require('./inventoryTransaction')(sequelize, DataTypes);

// Define associations
Product.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Product, { foreignKey: 'supplier_id' });

InventoryTransaction.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(InventoryTransaction, { foreignKey: 'product_id' });

InventoryTransaction.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(InventoryTransaction, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Product,
  Supplier,
  InventoryTransaction
};
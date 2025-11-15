module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    sku: {
      type: DataTypes.STRING(50),
      unique: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    cost_price: {
      type: DataTypes.DECIMAL(10, 2)
    },
    min_stock_level: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    supplier_id: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Product;
};
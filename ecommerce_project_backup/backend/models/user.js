// const bcrypt = require('bcryptjs');

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     username: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true
//     },
//     email: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true
//       }
//     },
//     password: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     role: {
//       type: DataTypes.ENUM('admin', 'user'),
//       defaultValue: 'user'
//     }
//   }, {
//     tableName: 'users',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//     hooks: {
//       beforeCreate: async (user) => {
//         user.password = await bcrypt.hash(user.password, 10);
//       },
//       beforeUpdate: async (user) => {
//         if (user.changed('password')) {
//           user.password = await bcrypt.hash(user.password, 10);
//         }
//       }
//     }
//   });

//   User.prototype.validatePassword = async function(password) {
//     return await bcrypt.compare(password, this.password);
//   };

//   return User;
// };



const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  // Instance method to validate password
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
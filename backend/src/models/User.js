import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  familyName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'examiner'),
    defaultValue: 'user'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'Diverse'),
    allowNull: true
  },
  countryOfBirth: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  birthPlace: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  nativeLanguage: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  currentCity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  currentCountry: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  placeOfResidence: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  countryOfResidence: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  idType: {
    type: DataTypes.ENUM('passport', 'national_id', 'drivers_license', 'other'),
    allowNull: true
  },
  idNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  profilePictureUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.resetPasswordToken;
  return values;
};

export default User;

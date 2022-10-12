/* eslint-disable no-underscore-dangle,no-use-before-define */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validation = require('../entity/validation');
const config = require('../config');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      validation.checkEmail(value);
    },
  },
  nickName: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      validation.checkNickName(value);
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      maxlength: 1000,
      required: true,
    },
  }],
  plan: {
    type: String,
    maxlength: 30,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'Plan is invalid');
    },
  },
  planBegin: {
    type: Date,
  },
  planEnd: {
    type: Date,
  },
  avatar: {
    type: String,
    maxlength: 1000,
    minlength: 0,
    validate(value) {
      validation.checkString(value, 'Avatar is invalid');
    },
    default: '',
  },
  firstName: {
    type: String,
    maxlength: 30,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'First name is invalid');
    },
  },
  lastName: {
    type: String,
    maxlength: 30,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'Last name is invalid');
    },
  },
  publicEmail: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      validation.checkEmail(value);
    },
  },
  webSite: {
    type: String,
    validate(value) {
      validation.checkUrl(value);
    },
  },
  phone: {
    type: Array,
    validate(value) {
      validation.checkPhone(value);
    },
  },
  contacts: {
    type: Array,
    validate(value) {
      validation.checkContacts(value);
    },
  },
}, {
  timestamps: true,
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.createdAt;
  delete userObject.updatedAt;

  return userObject;
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, config.jwtSecret);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

userSchema.statics.findByToken = async (id, token) => {
  const user = await User.findOne({ _id: id, 'tokens.token': token });

  if (!user) {
    throw new Error('User was not found for this token');
  }

  return user;
};

userSchema.statics.findById = async (id) => {
  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new Error('User was not found for this id');
  }

  return user;
};

userSchema.statics.findByNickName = async (value) => {
  const user = await User.find({ nickName: { $regex: value } }).limit(10);

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

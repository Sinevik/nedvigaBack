const mongoose = require('mongoose');
const validation = require('../entity/validation');

const verifyEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      validation.checkEmail(value);
    },
  },
  purpose: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value !== 'signUp' && value !== 'resetPassword') {
        throw new Error('Unknown purpose');
      }
    },
  },
  token: {
    type: String,
    maxlength: 1000,
    required: true,
  },
}, {
  timestamps: true,
});


const VerifyEmail = mongoose.model('VerifyEmail', verifyEmailSchema);

module.exports = VerifyEmail;

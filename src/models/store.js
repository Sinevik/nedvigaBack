/* eslint-disable no-underscore-dangle,no-use-before-define */
const mongoose = require('mongoose');
const validation = require('../entity/validation');

const storeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      validation.checkEmail(value);
    },
  },
  avatar: {
    type: String,
    maxlength: 1000,
    minlength: 10,
    validate(value) {
      validation.checkString(value, 'Avatar is invalid');
    },
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRXjZ48OOt8qJnBy2p3VzoA44Amdc4wG0MZz4L7KulpG34y0bwu2xi4VcgFatT8oR_BIdlZz5lPwlUdMcEL04LNvEYobfqp3dCxNTex&usqp=CAU&ec=45714079',
  },
  legalName: {
    required: true,
    type: String,
    maxlength: 30,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'Legal name is invalid');
    },
  },
  unp: {
    required: true,
    type: String,
    maxlength: 30,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'Unp is invalid');
    },
  },
  webSite: {
    type: String,
    validate(value) {
      validation.checkUrl(value);
    },
  },
  unpPhoto: {
    required: true,
    type: String,
    maxlength: 1000,
    minlength: 10,
    validate(value) {
      validation.checkString(value, 'UnpPhoto is invalid');
    },
  },
  description: {
    required: true,
    type: String,
    maxlength: 1000,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'Description is invalid');
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
  categories: {
    type: Array,
    validate(value) {
      validation.checkCategories(value);
    },
  },
  address: {
    type: Array,
    validate(value) {
      validation.checkAddress(value);
    },
  },
  up: {
    type: Date,
    default: Date.now,
  },
  photos: {
    type: Array,
    validate(value) {
      validation.checkPhotos(value);
    },
  },
}, {
  timestamps: true,
});

storeSchema.statics.findById = async (id) => {
  const store = await Store.findOne({ _id: id });

  if (!store) {
    throw new Error('Store was not found for this id');
  }

  return store;
};

storeSchema.statics.findByLegalName = async (value) => {
  const stores = await Store.find({ legalName: { $regex: value } }).limit(10);

  return stores;
};

storeSchema.statics.findByIdArray = async ({ arr, nPerPage, pageNumber }) => {
  const stores = await Store.find({ _id: { $in: arr } })
    .sort({ datefield: -1 })
    .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
    .limit(nPerPage);

  return stores;
};

storeSchema.statics.countByIdArray = async ({ arr }) => {
  const number = await Store.count({ _id: { $in: arr } });

  return number;
};

storeSchema.statics.findByUserId = async ({ id }) => {
  const store = await Store.findOne({ owner: id });

  return store;
};

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;

/* eslint-disable no-underscore-dangle,no-use-before-define,max-len */
const mongoose = require('mongoose');
const validation = require('../entity/validation');

const latLngStoreSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Store',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      validate(value) {
        validation.checkString(value, 'Location type is invalid');
      },
      required: true,
    },
    coordinates: {
      type: Array,
      required: true,
      validate(value) {
        validation.checkLocation(value);
      },
    },
  },
  categories: {
    type: Array,
    validate(value) {
      validation.checkCategories(value);
    },
  },
  /* --------- */
}, {
  timestamps: true,
});

latLngStoreSchema.index({ location: '2dsphere' });

latLngStoreSchema.statics.findBy = async ({
  latitude,
  longitude,
  category, 
  maxDistance,
}) => {
  const searchObject = {
    location:
      {
        $near:
          {
            $geometry: { type: 'Point', coordinates: [latitude, longitude] },
            $minDistance: 0,
            $maxDistance: maxDistance,
          },
      },
    categories: category,
  };

  const coordinates = await LatLngStore.find(searchObject);

  return coordinates;
};

const LatLngStore = mongoose.model('LatLngStore', latLngStoreSchema);

module.exports = LatLngStore;

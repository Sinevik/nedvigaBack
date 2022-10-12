/* eslint-disable no-underscore-dangle,no-use-before-define,max-len */
const mongoose = require('mongoose');
const validation = require('../entity/validation');
const search = require('../entity/search');

const posterSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    required: true,
    type: String,
    maxlength: 30,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'Name is invalid');
    },
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
  phone: {
    type: Array,
    required: true,
    validate(value) {
      validation.checkPhone(value);
    },
  },
  type: {
    required: true,
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkType(value);
    },
  },
  typePoster: {
    required: true,
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkTypePoster(value);
    },
  },
  area: {
    required: true,
    type: Number,
    validate(value) {
      validation.checkArea(value);
    },
  },
  price: {
    required: true,
    type: Number,
    validate(value) {
      validation.checkPrice(value);
    },
  },
  typeSales: {
    required: true,
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkTypeSales(value);
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
  fullAddress: {
    required: true,
    type: String,
    maxlength: 1000,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'FullAddress is invalid');
    },
  },
  city: {
    required: true,
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'City is invalid');
    },
  },
  photos: {
    required: true,
    type: Array,
    validate(value) {
      validation.checkPhotos(value);
    },
  },
  /* --------- */
  typeCommercial: {
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkTypeCommercial(value);
    },
  },
  typeApartment: {
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkTypeApartment(value);
    },
  },
  legalName: {
    type: String,
    maxlength: 30,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'Legal name is invalid');
    },
  },
  state: {
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkState(value);
    },
  },
  unp: {
    type: String,
    maxlength: 30,
    minlength: 1,
    validate(value) {
      validation.checkString(value, 'Unp is invalid');
    },
  },
  wallMaterial: {
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkWallMaterial(value);
    },
  },
  parkingPlace: {
    type: String,
    maxlength: 100,
    minlength: 1,
    validate(value) {
      validation.checkParkingPlace(value);
    },
  },
  /* ------ */
  countRooms: {
    type: Number,
    validate(value) {
      validation.checkCountRooms(value);
    },
  },
  floor: {
    type: Number,
    validate(value) {
      validation.checkFloor(value);
    },
  },
  countFloors: {
    type: Number,
    validate(value) {
      validation.checkCountFloors(value);
    },
  },
  livingArea: {
    type: Number,
    validate(value) {
      validation.checkArea(value);
    },
  },
  kitchenArea: {
    type: Number,
    validate(value) {
      validation.checkArea(value);
    },
  },
  landArea: {
    type: Number,
    validate(value) {
      validation.checkArea(value);
    },
  },
  ceilingHeight: {
    type: Number,
    validate(value) {
      validation.checkCeilingHeight(value);
    },
  },
  countSeatsShed: {
    type: Number,
    validate(value) {
      validation.checkCountRooms(value);
    },
  },
  yearOfConstruction: {
    type: Number,
    validate(value) {
      validation.checkYearOfConstruction(value);
    },
  },
  /* ------- */
  loggia: {
    type: Boolean,
    validate(value) {
      validation.checkLoggia(value);
    },
  },
  combineKitchen: {
    type: Boolean,
    validate(value) {
      validation.checkCombineKitchen(value);
    },
  },
  shed: {
    type: Boolean,
    validate(value) {
      validation.checkShed(value);
    },
  },
  /* ------ */
  contacts: {
    type: Array,
    validate(value) {
      validation.checkContacts(value);
    },
  },
  comfort: {
    type: Array,
    validate(value) {
      validation.checkComfort(value);
    },
  },
  conditionsRent: {
    type: Array,
    default: null,
    validate(value) {
      validation.checkConditionsRent(value);
    },
  },
  callTime: {
    from: {
      type: String,
      required: true,
      validate(value) {
        validation.checkCallTime(value);
      },
    },
    to: {
      type: String,
      required: true,
      validate(value) {
        validation.checkCallTime(value);
      },
    },
  },
  up: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

posterSchema.index({ location: '2dsphere' });

posterSchema.statics.findBy = async ({
  req, nPerPage, pageNumber, maxDistance, 
}) => {
  const searchObject = search(req, maxDistance);

  const posters = await Poster.find(searchObject)
    .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0).limit(nPerPage).sort({ up: 'descending' });

  return posters;
};

posterSchema.statics.countBy = async ({ req, maxDistance }) => {
  const searchObject = search(req, maxDistance);

  const number = await Poster.count(searchObject);

  return number;
};

posterSchema.statics.findByShort = async ({
  req, maxDistance,
}) => {
  const searchObject = search(req, maxDistance);
  
  const posters = await Poster.find(searchObject).select({ location: 1, _id: 1 });

  return posters;
};

posterSchema.statics.findById = async (id) => {
  const poster = await Poster.find({ _id: id });

  return poster;
};

posterSchema.statics.findByIdArray = async ({ arr, nPerPage, pageNumber }) => {
  let posters;
  if (pageNumber) {
    posters = await Poster.find({ _id: { $in: arr } })
      .sort({ datefield: -1 })
      .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
      .limit(nPerPage);
  } else {
    posters = await Poster.find({ _id: { $in: arr } });
  }
  return posters;
};

posterSchema.statics.countByIdArray = async ({ arr }) => {
  const number = await Poster.count({ _id: { $in: arr } });

  return number;
};

posterSchema.statics.findByUserId = async ({ id, nPerPage, pageNumber }) => {
  const posters = await Poster.find({ owner: id })
    .sort({ datefield: -1 })
    .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
    .limit(nPerPage);

  return posters;
};

posterSchema.statics.countByUserId = async ({ id }) => {
  const number = await Poster.count({ owner: id });

  return number;
};

posterSchema.statics.getPostersHome = async () => {
  const posters = await Poster.aggregate([{ $match: { type: 'flat', typePoster: 'sale' } }, { $sample: { size: 10 } }]);

  return posters;
};

const Poster = mongoose.model('Poster', posterSchema);

module.exports = Poster;

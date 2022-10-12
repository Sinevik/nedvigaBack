/* eslint-disable guard-for-in */
const validator = require('validator');

const validation = {
  checkString(value, error) {
    if (
      typeof value !== 'string'
      || value === 'true'
      || value === 'false'
      || value === 'null'
      || value === 'undefined') {
      throw new Error(error);
    }
  },
  checkEmail(value) {
    if (!validator.isEmail(value)) {
      throw new Error('Email is invalid');
    }
  },
  checkNickName(value) {
    const re = /[^a-z ]/i;
    if (value.length === '0') {
      throw new Error('Nickname is invalid');
    }
    if (value.length > 20) {
      throw new Error('Nickname is invalid');
    }
    if (re.test(String(value).toLowerCase())) {
      throw new Error('Nickname is invalid');
    }
  },
  checkSearchValue(value) {
    if (typeof value !== 'string') {
      throw new Error('Search value is invalid');
    }
    if (value.length > 50) {
      throw new Error('Search value is invalid');
    }
  },
  checkUrl(value) {
    if (value.length === 0) {
      throw new Error('Url is invalid');
    }
    if (!validator.isURL(value, { protocols: ['http', 'https'] })) {
      throw new Error('Url is invalid');
    }
  },
  checkPhone(value) {
    if (!(value instanceof Array)) {
      throw new Error('Phone is invalid');
    }

    const re = /^-?\d+$/;

    value.forEach((item) => {
      if (typeof item !== 'string') {
        throw new Error('Phone is invalid');
      }
      if (item.length === 0) {
        throw new Error('Phone is invalid');
      }
      if (item.length > 13 || item.length < 13) {
        throw new Error('Phone is invalid');
      }
      if (item.substring(0, 4) !== '+375') {
        throw new Error('Phone is invalid');
      }
      if (!re.test(item.substring(3))) {
        throw new Error('Phone is invalid');
      }
    });
  },
  checkIds(value) {
    if (!(value instanceof Array)) {
      throw new Error('Ids is invalid');
    }

    value.forEach((item) => {
      if (typeof item !== 'string') {
        throw new Error('Ids is invalid');
      }
      if (item.length === 0) {
        throw new Error('Ids is invalid');
      }
      if (item.length > 150) {
        throw new Error('Ids is invalid');
      }
    });
  },
  checkContacts(value) {
    if (!(value instanceof Array)) {
      throw new Error('Contacts is invalid');
    }
    if (value.length > 100) {
      throw new Error('Contacts is invalid');
    }

    value.forEach((item) => {
      if (typeof item !== 'object' || item === null) {
        throw new Error('Contacts is invalid');
      }
      if (Object.keys(item).length !== 2) {
        throw new Error('Contacts is invalid');
      }
      if (!item.method || typeof item.method !== 'string' || item.method.length > 500) {
        throw new Error('Contacts is invalid');
      }
      if (!item.path || typeof item.path !== 'string' || item.path.length > 500) {
        throw new Error('Contacts is invalid');
      }
    });
  },
  checkCategories(value) {
    if (!(value instanceof Array)) {
      throw new Error('Categories is invalid');
    }

    if (value.length > 100 || value.length === 0) {
      throw new Error('Categories is invalid');
    }

    value.forEach((item) => {
      if (typeof item !== 'string') {
        throw new Error('Categories is invalid');
      }
      if (item.length === 0) {
        throw new Error('Categories is invalid');
      }
      if (item.length > 100) {
        throw new Error('Phone is invalid');
      }
    });
  },
  checkAddress(value) {
    if (!(value instanceof Array)) {
      throw new Error('Address is invalid');
    }
    if (value.length > 100) {
      throw new Error('Address is invalid');
    }

    value.forEach((item) => {
      if (typeof item !== 'object' || item === null) {
        throw new Error('Address is invalid');
      }
      if (Object.keys(item).length !== 4) {
        throw new Error('Address is invalid');
      }
      if (!item.lat || typeof item.lat !== 'number' || item.lat.toString().length > 100) {
        throw new Error('Address is invalid');
      }
      if (!item.lng || typeof item.lng !== 'number' || item.lat.toString().length > 100) {
        throw new Error('Address is invalid');
      }
      if (!item.fullAddress || typeof item.fullAddress !== 'string' || item.fullAddress.length > 100) {
        throw new Error('Address is invalid');
      }
      if (!item.city || typeof item.city !== 'string' || item.city.length > 100) {
        throw new Error('Address is invalid');
      }
    });
  },
  checkPhotos(value) {
    if (!(value instanceof Array)) {
      throw new Error('Photos is invalid');
    }

    if (value.length > 100 || value.length < 1) {
      throw new Error('Photos is invalid');
    }

    value.forEach((item) => {
      if (typeof item !== 'string') {
        throw new Error('Photos is invalid');
      }
      if (item.length === 0) {
        throw new Error('Photos is invalid');
      }
      if (item.length > 1000 || item.length < 10) {
        throw new Error('Photos is invalid');
      }
    });
  },
  checkKey(value) {
    if (!(value instanceof Array)) {
      throw new Error('Key is invalid');
    }

    if (value.length > 100 || value.length < 1) {
      throw new Error('Key is invalid');
    }

    value.forEach((item) => {
      if (typeof item !== 'string') {
        throw new Error('Key is invalid');
      }
      if (item.length === 0) {
        throw new Error('Key is invalid');
      }
      if (item.length > 1000 || item.length < 10) {
        throw new Error('Key is invalid');
      }
    });
  },
  checkType(value) {
    this.checkString(value, 'Type is invalid');
    if (
      value !== 'flat'
      && value !== 'house'
      && value !== 'dacha'
      && value !== 'shed'
      && value !== 'land'
      && value !== 'room'
      && value !== 'commercial'
    ) {
      throw new Error('Poster type is invalid');
    }
  },
  checkTypePoster(value) {
    this.checkString(value, 'Poster type is invalid');
    if (value !== 'rent' && value !== 'sale') {
      throw new Error('Poster type is invalid');
    }
  },
  checkTypeApartment(value) {
    this.checkString(value, 'Apartment type is invalid');
    if (value !== 'first' && value !== 'second') {
      throw new Error('Apartment type is invalid');
    }
  },
  checkComfort(value) {
    if (!(value instanceof Array)) {
      throw new Error('Comfort is invalid');
    }

    if (value.length > 100) {
      throw new Error('Comfort is invalid');
    }

    value.forEach((item) => {
      if (typeof item !== 'string') {
        throw new Error('Comfort is invalid');
      }
      if (item.length === 0) {
        throw new Error('Comfort is invalid');
      }
      if (item.length > 100 || item.length < 2) {
        throw new Error('Comfort is invalid');
      }
    });
  },
  checkWallMaterial(value) {
    this.checkString(value, 'Wall Material is invalid');
    if (
      value !== 'cube'
      && value !== 'panel'
      && value !== 'monolith'
      && value !== 'block'
      && value !== 'tree'
      && value !== 'metal'
      && value !== 'other'
    ) {
      throw new Error('Wall Material is invalid');
    }
  },
  checkState(value) {
    this.checkString(value, 'State is invalid');
    if (
      value !== 'decoration'
      && value !== 'not-decoration'
      && value !== 'building'
    ) {
      throw new Error('State is invalid');
    }
  },
  checkCountRooms(value) {
    if (typeof value !== 'number') {
      throw new Error('Count rooms is invalid');
    }
    if (value < 1 || value > 100) {
      throw new Error('Count rooms is invalid');
    }
  },
  checkBoolean(value, error) {
    if (typeof value !== 'boolean') {
      throw new Error(error);
    }
  },
  checkLoggia(value) {
    if (typeof value !== 'boolean') {
      throw new Error('Rooms is invalid');
    }
  },
  checkParkingPlace(value) {
    this.checkString(value, 'Parking place is invalid');
    if (
      value !== 'no'
      && value !== 'outside'
      && value !== 'underground'
    ) {
      throw new Error('Parking place is invalid');
    }
  },
  checkFloor(value) {
    if (typeof value !== 'number') {
      throw new Error('Floor is invalid');
    }
    if (value < 0 || value > 100) {
      throw new Error('Floor is invalid');
    }
  },
  checkCountFloors(value) {
    if (typeof value !== 'number') {
      throw new Error('Count floors is invalid');
    }
    if (value < 0 || value > 100) {
      throw new Error('Count floors is invalid');
    }
  },
  checkCombineKitchen(value) {
    if (typeof value !== 'boolean') {
      throw new Error('Combine kitchen is invalid');
    }
  },
  checkArea(value) {
    if (typeof value !== 'number') {
      throw new Error('Area is invalid');
    }
    if (value < 1 || value > 1000000) {
      throw new Error('Area is invalid');
    }
  },
  checkCeilingHeight(value) {
    if (typeof value !== 'number') {
      throw new Error('Ceiling height is invalid');
    }
    if (value < 1 || value > 100) {
      throw new Error('Ceiling height is invalid');
    }
  },
  checkYearOfConstruction(value) {
    if (typeof value !== 'number') {
      throw new Error('Year of construction is invalid');
    }
    if (value < 1900 || value > 2050) {
      throw new Error('Year of construction is invalid');
    }
  },
  checkTypeRent(value) {
    if (value !== null) {
      this.checkString(value, 'Type rent is invalid');
      if (
        value !== 'monthly'
        && value !== 'daily'
        && value !== 'year'
      ) {
        throw new Error('Type rent is invalid');
      }
    }
  },
  checkConditionsRent(value) {
    if (value !== null) {
      if (!(value instanceof Array)) {
        throw new Error('Conditions rent is invalid');
      }

      if (value.length > 100) {
        throw new Error('Conditions rent is invalid');
      }

      value.forEach((item) => {
        if (typeof item !== 'string') {
          throw new Error('Conditions rent is invalid');
        }
        if (
          item !== 'students'
          && item !== 'children'
          && item !== 'animals'
        ) {
          throw new Error('Conditions rent is invalid');
        }
      });
    }
  },
  checkPrice(value) {
    if (typeof value !== 'number') {
      throw new Error('Price is invalid');
    }
    if (value < 0 || value > 1000000000) {
      throw new Error('Price is invalid');
    }
  },
  checkTypeSales(value) {
    this.checkString(value, 'Type Sales is invalid');
    if (
      value !== 'owner'
      && value !== 'agency'
      && value !== 'developer'
      && value !== 'government'
    ) {
      throw new Error('Type Sales is invalid');
    }
  },
  checkCallTime(value) {
    const variants = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    this.checkString(value, 'Call time is invalid');
    if (!variants.includes(value)) {
      throw new Error('Call time is invalid');
    }
  },
  checkShed(value) {
    if (typeof value !== 'boolean') {
      throw new Error('Shed is invalid');
    }
  },
  checkTypeCommercial(value) {
    this.checkString(value, 'Type commercial is invalid');
    if (
      value !== 'industrial'
      && value !== 'catering'
      && value !== 'sales'
      && value !== 'warehouse'
      && value !== 'office'
      && value !== 'hotel'
    ) {
      throw new Error('Type commercial is invalid');
    }
  },
  checkLocation(value) {
    if (!(value instanceof Array)) {
      throw new Error('Location is invalid');
    }
    if (value.length !== 2) {
      throw new Error('Location is invalid');
    }

    value.forEach((item) => {
      if (typeof item !== 'number') {
        throw new Error('Location is invalid');
      }
      if (item.toString().length > 100) {
        throw new Error('Location is invalid');
      }
      if (item.toString().length < 1) {
        throw new Error('Location is invalid');
      }
    });
  },
  checkFindReq(value) {
    for (const item in value) {
      if (
        typeof value[item] !== 'number'
        && typeof value[item] !== 'string'
        && value[item] !== null
        && !(value[item] instanceof Array)

      ) {
        throw new Error('Invalid data requests');
      }

      if (typeof value[item] === 'number' && value[item] > 100000000000) {
        throw new Error('Invalid data requests');
      }

      if (typeof value[item] === 'string' && value[item].length > 300) {
        throw new Error('Invalid data requests');
      }

      if ((value[item] instanceof Array)) {
        if (value[item].length > 50) {
          throw new Error('Invalid data requests');
        }

        value[item].forEach((str) => {
          if (typeof str !== 'string') {
            throw new Error('Invalid data requests');
          }
          if (typeof str.length > 20) {
            throw new Error('Invalid data requests');
          }
        });
      }
    }
  },
};

validation.checkTypePoster = validation.checkTypePoster.bind(validation);
validation.checkType = validation.checkType.bind(validation);
validation.checkTypeApartment = validation.checkTypeApartment.bind(validation);
validation.checkTypeRent = validation.checkTypeRent.bind(validation);
validation.checkTypeCommercial = validation.checkTypeCommercial.bind(validation);
validation.checkTypeSales = validation.checkTypeSales.bind(validation);
validation.checkConditionsRent = validation.checkConditionsRent.bind(validation);
validation.checkWallMaterial = validation.checkWallMaterial.bind(validation);
validation.checkState = validation.checkState.bind(validation);
validation.checkCallTime = validation.checkCallTime.bind(validation);

module.exports = validation;

/* eslint-disable max-len */
const validation = require('./validation');

const search = (req, maxDistance) => {
  validation.checkFindReq(req);

  const searchObject = {
    location:
      {
        $near:
          {
            $geometry: { type: 'Point', coordinates: [req.latitude, req.longitude] },
            $minDistance: 0,
            $maxDistance: maxDistance,
          },
      },
    type: req.type,
    latLngRepeat: true,
    price: { $gte: req.priceFrom || 0, $lte: req.priceTo || 100000000000000 },
    area: { $gte: req.areaFrom || 0, $lte: req.areaTo || 100000000000000 },
  };

  if (req.typePoster) {
    searchObject.typePoster = req.typePoster;
  }

  if (req.typeApartment) {
    searchObject.typeApartment = { $in: req.typeApartment };
  }

  if (req.typeCommercial) {
    searchObject.typeCommercial = { $in: req.typeCommercial };
  }

  if (req.wallMaterial) {
    searchObject.wallMaterial = { $in: req.wallMaterial };
  }

  if (req.state) {
    searchObject.state = { $in: req.state };
  }

  if (req.countRoomsFrom || req.countRoomsTo) {
    if (req.type === 'flat' && req.countRoomsTo === 6) {
      searchObject.countRooms = { $gte: req.countRoomsFrom, $lte: 100000000000000 };
    } else {
      searchObject.countRooms = { $gte: req.countRoomsFrom || 0, $lte: req.countRoomsTo || 100000000000000 };
    }
  }

  if (req.countFloorsFrom || req.countFloorsTo) {
    if ((req.type === 'house' || req.type === 'dacha') && req.countFloorsTo === 6) {
      searchObject.countFloors = { $gte: req.countFloorsFrom, $lte: 100000000000000 };
    } else {
      searchObject.countFloors = { $gte: req.countFloorsFrom || 0, $lte: req.countFloorsTo || 100000000000000 };
    }
  }

  if (req.countFloorFrom || req.countFloorTo) {
    searchObject.floor = { $gte: req.countFloorFrom || 0, $lte: req.countFloorTo || 100000000000000 };
  }

  if (req.countSeatsShedFrom || req.countSeatsShedTo) {
    if (req.countSeatsShedTo === 4) {
      searchObject.countSeatsShed = { $gte: req.countSeatsShedFrom, $lte: 100000000000000 };
    } else {
      searchObject.countSeatsShed = { $gte: req.countSeatsShedFrom || 0, $lte: req.countSeatsShedTo || 100000000000000 };
    }
  }

  if (req.kitchenAreaFrom || req.kitchenAreaTo) {
    searchObject.kitchenArea = { $gte: req.kitchenAreaFrom || 0, $lte: req.kitchenAreaTo || 100000000000000 };
  }

  if (req.livingAreaFrom || req.livingAreaTo) {
    searchObject.livingArea = { $gte: req.livingAreaFrom || 0, $lte: req.livingAreaTo || 100000000000000 };
  }

  if (req.landAreaFrom || req.landAreaTo) {
    searchObject.landArea = { $gte: req.landAreaFrom || 0, $lte: req.landAreaTo || 100000000000000 };
  }

  if (req.yearOfConstructionFrom || req.yearOfConstructionTo) {
    searchObject.yearOfConstruction = { $gte: req.yearOfConstructionFrom || 0, $lte: req.yearOfConstructionTo || 100000000000000 };
  }

  return searchObject;
};

module.exports = search;

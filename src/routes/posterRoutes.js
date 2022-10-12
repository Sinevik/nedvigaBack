const axios = require('axios');
const moment = require('moment');
const config = require('../config');
const Poster = require('../models/poster');
const { getIdFromUrl } = require('../entity/deleteLoaded');
const WorkLocation = require('../entity/workLocation');
const Map = require('../entity/map');

const auth = require('../middleware/auth');

module.exports = (app) => {
  app.post('/api/createPoster', auth, async (req, res) => {
    try {
      const poster = new Poster({
        ...req.body,
        owner: req.user._id,
        location: {
          type: 'Point',
          coordinates: [req.body.location.lat, req.body.location.lng],
        },
      });

      await poster.save();

      res.status(201).send({ poster });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/updatePoster', auth, async (req, res) => {
    try {
      const id = req.body._id;

      const poster = await Poster.findOne({ _id: id });

      if (!poster) {
        throw new Error('Poster not found');
      }

      delete req.body._id;
      delete req.body.owner;
      delete req.body.up;

      await poster.updateOne({
        ...req.body,
        location: {
          type: 'Point',
          coordinates: [req.body.location.lat, req.body.location.lng],
        },
      });

      const posterUpdate = await Poster.findOne({ _id: id });

      res.status(201).send({ poster: posterUpdate });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/upPoster', auth, async (req, res) => {
    try {
      const id = req.body._id;

      const poster = await Poster.findOne({ _id: id });

      if (!poster) {
        throw new Error('Poster not found');
      }

      delete req.body._id;
      delete req.body.owner;

      await poster.updateOne({
        up: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      });

      const posterUpdate = await Poster.findOne({ _id: id });

      res.status(201).send({ poster: posterUpdate });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/deletePoster', auth, async (req, res) => {
    try {
      const poster = await Poster.findOneAndDelete({ _id: req.body._id });

      if (!poster) {
        throw new Error('Poster not found');
      }

      const { photos } = poster;

      const uri = `${config.origin}/api/deleteLoaded`;

      for await (const link of photos) {
        const id = getIdFromUrl(link);
        await axios.post(uri, {
          id,
        });
      }

      res.status(201).send({ poster });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPostersByLatLng', async (req, res) => {
    try {
      const posters = await Poster.findBy({
        req: req.body,
        nPerPage: 20,
        pageNumber: req.body.pageNumber,
        maxDistance: WorkLocation.maxDistanceSearch,
      });

      res.status(201).send({ posters });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPostersByLatLngCount', async (req, res) => {
    try {
      const number = await Poster.countBy({
        req: req.body,
        maxDistance: WorkLocation.maxDistanceSearch,
      });

      res.status(201).send({ number });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPosterById', async (req, res) => {
    const { id } = req.body;
    try {
      const poster = await Poster.findById(id);

      res.status(201).send({ poster: poster[0] });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPostersByIdArray', async (req, res) => {
    const { ids, pageNumber } = req.body;
    try {
      const posters = await Poster.findByIdArray({
        arr: ids,
        nPerPage: 20,
        pageNumber,
      });

      res.status(201).send({ posters });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPostersByIdArrayCount', async (req, res) => {
    const { ids } = req.body;
    try {
      const number = await Poster.countByIdArray({
        arr: ids,
      });

      res.status(201).send({ number });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPostersMap', async (req, res) => {
    const distance = req.header('Distance');
    try {
      const posters = await Poster.findByShort({
        req: req.body,
        maxDistance: distance === 'max' ? WorkLocation.maxDistanceSearch : WorkLocation.minDistanceSearch,
      });
      const radius = posters.length > 1000 ? 1 : 0.1;
      const type = posters.length > 1000 ? 'number' : 'array';
      const map = new Map({ posters, rule: '_id' });
      map.groupCoordinates({ radius, type });
      const result = map.getResult();
      res.status(201).send({ posters: result });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPostersByUserId', async (req, res) => {
    const { id, pageNumber } = req.body;
    try {
      const posters = await Poster.findByUserId({
        id,
        nPerPage: 20,
        pageNumber,
      });

      res.status(201).send({ posters });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPostersByUserIdCount', async (req, res) => {
    const { id } = req.body;
    try {
      const number = await Poster.countByUserId({
        id,
      });
      res.status(201).send({ number });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/getPostersHome', async (req, res) => {
    try {
      const posters = await Poster.getPostersHome();
      res.status(201).send({ posters });
    } catch (e) {
      res.status(401).send(e);
    }
  });
};


/*const getRandomLocation = function (latitude, longitude, radiusInMeters) {
  const getRandomCoordinates = function (radius, uniform) {
    // Generate two random numbers
    let a = Math.random();
    let b = Math.random();

    // Flip for more uniformity.
    if (uniform) {
      if (b < a) {
        const c = b;
        b = a;
        a = c;
      }
    }

    // It's all triangles.
    return [
      b * radius * Math.cos(2 * Math.PI * a / b),
      b * radius * Math.sin(2 * Math.PI * a / b),
    ];
  };

  const randomCoordinates = getRandomCoordinates(radiusInMeters, true);

  // Earths radius in meters via WGS 84 model.
  const earth = 6378137;

  // Offsets in meters.
  const northOffset = randomCoordinates[0];
  const eastOffset = randomCoordinates[1];

  // Offset coordinates in radians.
  const offsetLatitude = northOffset / earth;
  const offsetLongitude = eastOffset / (earth * Math.cos(Math.PI * (latitude / 180)));

  // Offset position in decimal degrees.
  return [
    latitude + (offsetLatitude * (180 / Math.PI)),
    longitude + (offsetLongitude * (180 / Math.PI)),
  ];
};

/* const posters = [];
      for (let i = 0; i < 20000; i++) {
        const item = {
          _id: Date.now(),
          location: {
            type: 'Point',
            coordinates: getRandomLocation(53.893009, 27.567444, 10000),
          },
        };
        posters.push(item);
      } */

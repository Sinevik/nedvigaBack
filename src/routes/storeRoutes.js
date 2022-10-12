const Store = require('../models/store');
const LatLngStore = require('../models/latLngStore');
const WorkLocation = require('../entity/workLocation');
const auth = require('../middleware/auth');
const validation = require('../entity/validation');
const Map = require('../entity/map');

module.exports = (app) => {
  app.post('/api/createStore', auth, async (req, res) => {
    try {
      const allow = await Store.findOne({ owner: req.user._id });

      if (allow) {
        throw new Error('This user already has a store');
      }

      const store = new Store({
        owner: req.user._id,
        ...req.body,
      });

      const savedStore = await store.save();
      for await (const item of savedStore.address) {
        const latLngStore = new LatLngStore({
          storeId: savedStore._id,
          categories: savedStore.categories,
          location: {
            type: 'Point',
            coordinates: [item.lat, item.lng],
          },
        });
        await latLngStore.save();
      }
      res.status(201).send({ store });
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/updateStore', auth, async (req, res) => {
    try {
      const id = req.user._id;

      const store = await Store.findOne({ owner: req.user._id });

      if (!store) {
        throw new Error('Store not found');
      }

      delete req.body._id;
      delete req.body.owner;
      delete req.body.basic;

      await store.updateOne({
        ...req.body,
      });

      const storeUpdate = await Store.findOne({ owner: id });

      await LatLngStore.deleteMany({ storeId: storeUpdate._id });

      for await (const item of storeUpdate.address) {
        const latLngStore = new LatLngStore({
          storeId: storeUpdate._id,
          categories: storeUpdate.categories,
          location: {
            type: 'Point',
            coordinates: [item.lat, item.lng],
          },
        });
        await latLngStore.save();
      }

      res.status(201).send({ store: storeUpdate });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/getStoreById', async (req, res) => {
    try {
      const { id } = req.body;

      const store = await Store.findById(id);

      res.status(201).send({ store });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/getStoresByIdArray', async (req, res) => {
    try {
      const { ids, pageNumber } = req.body;

      const stores = await Store.findByIdArray(
        {
          arr: ids, nPerPage: 20, pageNumber,
        },
      );

      res.status(201).send({ stores });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/getStoresByLatLng', async (req, res) => {
    const {
      latitude,
      longitude,
      category,
      pageNumber,
    } = req.body;
    try {
      const posters = await LatLngStore.findBy({
        latitude,
        longitude,
        category,
        maxDistance: WorkLocation.maxDistanceSearch,
      });

      const ids = [...new Set(posters.map((item) => item.storeId))];

      const stores = await Store.findByIdArray(
        {
          arr: ids, nPerPage: 20, pageNumber,
        },
      );

      res.status(201).send({ stores });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/getStoresByIdLatLngCount', async (req, res) => {
    const {
      latitude,
      longitude,
      category,
    } = req.body;
    try {
      const posters = await LatLngStore.findBy({
        latitude,
        longitude,
        category,
        maxDistance: WorkLocation.maxDistanceSearch,
      });

      const ids = [...new Set(posters.map((item) => item.storeId))];

      const number = await Store.countByIdArray(
        {
          arr: ids,
        },
      );

      res.status(201).send({ number });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/getStoresMap', async (req, res) => {
    const {
      latitude,
      longitude,
      category,
    } = req.body;

    try {
      const posters = await LatLngStore.findBy({
        latitude,
        longitude,
        category,
        maxDistance: WorkLocation.maxDistanceSearch,
      });
      const radius = 0.1;
      const type = 'array';
      const map = new Map({ posters, rule: 'storeId' });
      map.groupCoordinates({ radius, type });
      const result = map.getResult();
      res.status(201).send({ stores: result });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/getStoreByLegalName', async (req, res) => {
    try {
      const { value } = req.body;
      validation.checkSearchValue(value);

      const stores = await Store.findByLegalName(value);

      res.status(201).send({ stores });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });
};

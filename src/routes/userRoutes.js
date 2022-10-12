/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const auth = require('../middleware/auth');
const validation = require('../entity/validation');
const Store = require('../models/store');

module.exports = (app) => {
  app.post('/api/getUserByToken', auth, async (req, res) => {
    try {
      const store = await Store.findByUserId({ id: req.user._id });

      res.status(201).send({ user: req.user, store });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/getUserById', async (req, res) => {
    try {
      const { id } = req.body;

      const user = await User.findById(id);

      res.status(201).send({ user });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/getUserByNickName', async (req, res) => {
    try {
      const { value } = req.body;
      validation.checkSearchValue(value);

      const users = await User.findByNickName(value);

      res.status(201).send({ users });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/updateUser', auth, async (req, res) => {
    try {
      delete req.body._id;
      delete req.body.password;
      delete req.body.email;
      delete req.body.nickName;
      delete req.body.tokens;
      delete req.body.basic;

      await req.user.updateOne({
        ...req.body,
      });

      res.status(201).send({ status: 'successful' });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });
};

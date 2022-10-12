const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { sendEmail } = require('../entity/email');
const config = require('../config');
const VerifyEmail = require('../models/verifyEmail');
const User = require('../models/user');

module.exports = (app) => {
  app.post('/api/checkTokenVerifyEmail', async (req, res) => {
    try {
      const { token } = req.body;

      jwt.verify(token, config.jwtSecret);

      res.status(201).send({ token });
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });

  app.post('/api/verifyEmail', async (req, res) => {
    try {
      const { email, purpose, validTokenCaptcha } = req.body;

      if (!validTokenCaptcha) {
        throw new Error('invalidTokenCaptcha');
      }

      const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.captchaKey}&response=${validTokenCaptcha}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      });

      if (!response.data.success) {
        throw new Error('invalidTokenCaptcha');
      }

      if (purpose === 'signUp' && await User.findOne({ email })) {
        throw new Error('Email already busy');
      }

      if (purpose === 'resetPassword' && !await User.findOne({ email })) {
        throw new Error('No such email was found');
      }

      const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });

      let verifyEmail = await VerifyEmail.findOne({ email });


      if (!verifyEmail) {
        verifyEmail = new VerifyEmail({
          email,
          purpose,
          token,
        });
        await verifyEmail.save();
      } else {
        await verifyEmail.updateOne({
          token,
          purpose,
        });
      }

      await sendEmail({
        req,
        token,
        userEmail: email,
        purpose,
      });

      res.status(201).send({ email: 'Email sent' });
    } catch (e) {
      if (e.message === 'Email already busy') {
        res.status(201).send({ email: 'email-already-busy' });
      } else if (e.message === 'No such email was found') {
        res.status(201).send({ email: 'no-such-email-was-found' });
      } else {
        res.status(401).send(e);
      }
    }
  });

  app.post('/api/signUp', async (req, res) => {
    try {
      const { token, password, nickName } = req.body;

      const decoded = jwt.verify(token, config.jwtSecret);

      const verifyEmail = await VerifyEmail.findOne({ email: decoded.email });

      if (await User.findOne({ nickName })) {
        throw new Error('This nickname already exists');
      }

      if (verifyEmail
        && verifyEmail.token === token
        && verifyEmail.purpose === 'signUp'
        && !await User.findOne({ email: decoded.email })
      ) {
        const user = new User({
          email: decoded.email,
          password,
          nickName,
        });

        await user.save();

        const newToken = await user.generateAuthToken();

        res.status(201).send({ user, token: newToken });
      } else {
        throw new Error('Incorrect data');
      }
    } catch (e) {
      if (e.message === 'This nickname already exists') {
        res.status(201).send({ token: 'this-nickname-already-exists' });
      } else {
        res.status(401).send(e);
      }
    }
  });

  app.post('/api/logIn', async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findByCredentials(email, password);

      const token = await user.generateAuthToken();

      res.status(201).send({ user, token });
    } catch (e) {
      if (e.message === 'Unable to login') {
        res.status(201).send({ token: 'unable-to-login' });
      } else {
        res.status(401).send(e);
      }
    }
  });

  app.post('/api/resetPassword', async (req, res) => {
    try {
      const { token, password } = req.body;

      const decoded = jwt.verify(token, config.jwtSecret);

      const verifyEmail = await VerifyEmail.findOne({ email: decoded.email });

      const user = await User.findOne({ email: decoded.email });

      if (verifyEmail
        && verifyEmail.token === token
        && verifyEmail.purpose === 'resetPassword'
        && user
      ) {
        await user.updateOne({
          password: await bcrypt.hash(password, 8),
        });

        const newToken = await user.generateAuthToken();

        res.status(201).send({ user, token: newToken });
      } else {
        throw new Error('Incorrect data');
      }
    } catch (e) {
      console.log(e);
      res.status(401).send(e);
    }
  });
};

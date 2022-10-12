/* eslint-disable no-unused-expressions */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const upload = multer();
const streamifier = require('streamifier');
const cors = require('cors');

const config = require('./config');

const app = express();

// cors

app.use(cors({
  origin: '*',
}));

const customError = require('./customError');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cloudinary

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiSecret,
  secure: true,
});

// database
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl, () => { },
  { useNewUrlParser: true }, { useUnifiedTopology: true });
mongoose.set('runValidators', true);
const dbConnection = mongoose.connection;
dbConnection.on('error', (err) => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));

require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/storeRoutes')(app);

require('./routes/uploadRoutes')(app, cloudinary, upload, streamifier);

require('./routes/posterRoutes')(app);

customError();

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  err ? console.log(err) : console.log('Server started!');
});

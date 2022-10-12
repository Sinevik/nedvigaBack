module.exports = async (app, cloudinary, upload, streamifier) => {
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      const cldUploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: req.body.id,
          folder: 'workingByEstate',
          height: 800,
          width: 800,
          crop: 'limit',
        },
        (error, result) => {
          if (error) {
            res.status(401).send(error);
          } else {
            res.status(201).send({ url: result.url });
          }
        },
      );
      streamifier.createReadStream(req.file.buffer).pipe(cldUploadStream);
    } catch (e) {
      res.status(401).send(e);
    }
  });

  app.post('/api/deleteLoaded', async (req, res) => {
    try {
      cloudinary.uploader.destroy(
        `workingByEstate/${req.body.id}`,
        (error, result) => {
          if (error) {
            res.status(401).send(error);
          } else {
            res.status(201).send({ status: result.result });
          }
        },
      );
    } catch (e) {
      console.log('here', e);

      res.status(401).send(e);
    }
  });
};

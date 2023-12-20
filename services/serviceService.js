const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const Service = require("../models/serviceModel");
const factory = require("./handllerFactory");

exports.uploadServiceImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 10,
  },
]);
exports.convertToArray = (req, res, next) => {
  if (req.body.highlights_ar) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.highlights_ar)) {
      req.body.highlights_ar = [req.body.highlights_ar];
    }
  }
  if (req.body.highlights_en) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.highlights_en)) {
      req.body.highlights_en = [req.body.highlights_en];
    }
  }

  next();
};

//image processing
exports.resizeServiceImages = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `service-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 98 })
      .toFile(`uploads/service/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `service-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 98 })
          .toFile(`uploads/service/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }

  next();
});
//@desc get list of Services
//@route GET /api/v1/services
//@access public
exports.getServices = factory.getALl(Service, "Service");
//@desc get specific Service by id
//@route GET /api/v1/services/:id
//@access public
exports.getService = factory.getOne(Service, "reviews");
//@desc create Service
//@route POST /api/v1/service
//@access private
exports.createService = factory.createOne(Service);
//@desc update specific Service
//@route PUT /api/v1/services/:id
//@access private
exports.updateService = factory.updateOne(Service);

//@desc delete Service
//@route DELETE /api/v1/services/:id
//@access private
exports.deleteService = factory.deleteOne(Service);

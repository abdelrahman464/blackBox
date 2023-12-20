const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");

const ApiError = require("../apiError");

exports.createServiceValidator = [
  check("title_en")
    .notEmpty()
    .withMessage("Service english title required")
    .isLength({ min: 3 })
    .withMessage("Service english title must be at least 3 chars"),
  check("title_ar")
    .isLength({ min: 3 })
    .withMessage("Service arabic title must be at least 3 chars")
    .notEmpty()
    .withMessage("Service arabic title required"),
  check("description_en")
    .notEmpty()
    .withMessage("Service english description is required")
    .isLength({ min: 15 })
    .withMessage("Too short Service english description")
    .isLength({ max: 1000 })
    .withMessage("Too long Service english description"),
  check("description_ar")
    .notEmpty()
    .withMessage("Service arabic description is required")
    .isLength({ min: 15 })
    .withMessage("Too short Service arabic description")
    .isLength({ max: 1000 })
    .withMessage("Too long Service arabic description"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Service quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Service price is required")
    .isNumeric()
    .withMessage("Service price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Service priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("imageCover").notEmpty().withMessage("Service imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Service must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    // before i add Requst to category i must check if category is in database
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new ApiError(`No category for this id: ${categoryId}`, 404)
          );
        }
      })
    ),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  //catch error and return it as a response
  validatorMiddleware,
];

exports.getServiceValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateServiceValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  check("title_en")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Service english title must be at least 3 chars"),
  check("title_ar")
    .isLength({ min: 3 })
    .withMessage("Service arabic title must be at least 3 chars")
    .optional(),
  check("description_en")
    .optional()
    .isLength({ min: 15 })
    .withMessage("Too short Service english description")
    .isLength({ max: 1000 })
    .withMessage("Too long Service english description"),
  check("description_ar")
    .optional()
    .isLength({ min: 15 })
    .withMessage("Too short Service arabic description")
    .isLength({ max: 1000 })
    .withMessage("Too long Service arabic description"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Service quantity must be a number"),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Service price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Service priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    // before i add Requst to category i must check if category is in database
    .custom((categoryId) =>
      Category.findById(categoryId).then((cateogry) => {
        if (!cateogry) {
          return Promise.reject(
            new Error(`No Category for this id : ${categoryId}`)
          );
        }
      })
    ),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.deleteServiceValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

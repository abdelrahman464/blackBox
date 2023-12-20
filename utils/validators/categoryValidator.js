const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCategoryValidator = [
  //rules
  check("id").isMongoId().withMessage("Invalid category id format"),
  //catch error
  validatorMiddleware,
];
exports.createCategroyValidator = [
  check("title_en")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short category titel")
    .isLength({ max: 32 })
    .withMessage("too long category titel"),
  check("title_ar")
    .notEmpty()
    .withMessage("category arabic name required")
    .isLength({ min: 2 })
    .withMessage("too short category arabic titel ")
    .isLength({ max: 32 })
    .withMessage("too long category arabic titel"),
  
  validatorMiddleware,
];
exports.updateCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  body("title_en")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short category titel")
    .isLength({ max: 32 })
    .withMessage("too long category titel"),
  body("title_ar")
    .optional()
    .isLength({ min: 2 })
    .withMessage("too short category arabic titel ")
    .isLength({ max: 32 })
    .withMessage("too long category arabic titel"),
 
  validatorMiddleware,
];
exports.deleteCategroyValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

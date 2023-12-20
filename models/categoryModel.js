// database
const mongoose = require("mongoose");
//1- create schema
const categorySchema = mongoose.Schema(
  {
    title_ar: {
      type: String,
      required: [true, "category arabic title required"],
      unique: [true, "category arabic title must be unique"],
      minlength: [3, "too short category arabic title "],
      maxlength: [32, "too long category arabic title"],
    },
    title_en: {
      type: String,
      required: [true, "category english title required"],
      unique: [true, "category english title must be unique"],
      minlength: [3, "too short category english title "],
      maxlength: [32, "too long category english title "],
    },
  },
  { timestamps: true }
);

//2- create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;

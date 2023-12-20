const mongoose = require("mongoose");
const Service = require("./serviceModel");
//1- create schema
const reviewSchema = mongoose.Schema(
  {
    title: {
      type: "String",
    },
    ratings: {
      type: Number,
      min: [1, "min value is 1.0"],
      max: [5, "max value is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to user"],
    },
    // parent references (1 - many)
    service: {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      required: [true, "review must belong to service"],
    },
  },
  { timestamps: true }
);

// any query containe find
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profileImg" });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (serviceId) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific service
    {
      $match: { service: serviceId },
    },
    // Stage 2: Grouping reviews based on serviceId and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "service",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Service.findByIdAndUpdate(serviceId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Service.findByIdAndUpdate(serviceId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
//this function is called when i delete a review
reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.Service);
});
//this function is called when i save a review
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.Service);
});

//2- create model
const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;

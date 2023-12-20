const categoryRoute = require("./categoryRoute");
const ServiceRoute = require("./ServiceRoute");
const requestRoute = require("./requestRoute");
const userRoute = require("./userRoute");
const reviewRoute = require("./reviewRoute");
const orderRoute = require("./OrderRoute");
const authRoute = require("./authRoute");

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/services", ServiceRoute);
  app.use("/api/v1/requests", requestRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/orders", orderRoute);
  app.use("/api/v1/auth", authRoute);
};
module.exports = mountRoutes;

const express = require("express");

const authServices = require("../services/authServices");
const {
  AuthorityRequst,
  updateRequstStatus,
  getRequsts,
  getRequst,
  createRequst,
  deleteRequst,
  updateRequst,
} = require("../services/requestService");

const router = express.Router();

router
  .route("/")
  .get(authServices.protect, authServices.allowedTo("admin"), getRequsts)
  .post(authServices.protect, authServices.allowedTo("user"), createRequst);
router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("admin", "user"),
    AuthorityRequst,
    getRequst
  )
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    AuthorityRequst,
    updateRequst
  )
  .delete(authServices.protect, authServices.allowedTo("admin"), deleteRequst);
router
  .route("/:id/status")
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    updateRequstStatus
  );
module.exports = router;

const asyncHandler = require("express-async-handler");
const Requst = require("../models/serviceModel");
const factory = require("./handllerFactory");
const ApiError = require("../utils/apiError");



// if role user check if user is the owner of the request
exports.AuthorityRequst = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    const requst = await Requst.findById(req.params.id);
    if (requst.user.toString() !== req.user._id.toString()) {
      return next(new ApiError(`you are not the owner of this request`, 401));
    }
  }
  next();
});
//@desc send Requst
//@route Post /api/v1/requsts
//@access protected public
exports.createRequst = asyncHandler(async (req, res, next) => {
  const { requestId, textarea } = req.body;
  const newRequst = await Requst.create({
    user: req.user._id,
    request: requestId,
    textarea,
  });
  res.status(201).json({ status: "success", data: newRequst });
});
//@desc update request status
//@route Post /api/v1/requsts/:id/status
//@access protected private admin
exports.updateRequstStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const requestId = req.params.id;
  const updatedRequst = await Requst.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  );
  res.status(201).json({ status: "success", data: updatedRequst });
});
//@desc update request 
//@route Post /api/v1/requsts/:id
//@access protected private admin
exports.updateRequst = asyncHandler(async (req, res, next) => {
  const { textarea } = req.body;
  const requestId = req.params.id;
  const updatedRequst = await Requst.findByIdAndUpdate(
    requestId,
    { textarea },
    { new: true }
  );
  res.status(201).json({ status: "success", data: updatedRequst });
});
//@desc get list of requsts
//@route GET /api/v1/requsts
//@access public
exports.getRequsts = factory.getALl(Requst, "Request");


//@desc get specific requsts by id
//@route GET /api/v1/requsts/:id
//@access public
exports.getRequst = factory.getOne(Requst);
//@desc delete Service
//@route DELETE /api/v1/requsts/:id
//@access private
exports.deleteRequst = factory.deleteOne(Requst);

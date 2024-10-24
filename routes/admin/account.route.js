const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validates/admin/account.validates");
const multer = require("multer");
const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloudinary.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloudinary.upload,
  validate.editPatch,
  controller.editPatch
);
module.exports = router;

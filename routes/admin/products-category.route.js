const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const validates = require("../../validates/admin/product-category.validates");
const controller = require("../../controllers/admin/product-category.controller");

const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloudinary.upload,
  validates.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloudinary.upload,
  validates.createPost,
  controller.editPatch
);

module.exports = router;

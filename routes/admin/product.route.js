const express = require("express");
const router = express.Router();
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
const controller = require("../../controllers/admin/product.controller");
const validates = require("../../validates/admin/product.validates");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
    "/create", 
    upload.single("thumbnail"), 
    validates.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    upload.single("thumbnail"),
    validates.createPost,
    controller.editPatch);

router.get("/detail/:id", controller.detail);

module.exports = router;

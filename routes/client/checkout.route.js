const express = require("express");
const controller = require("../../controllers/client/checkout.controller")
const router = express.Router();

router.get("/", controller.index);

router.post("/oder", controller.checkoutPost);

router.get("/success/:orderId", controller.success);

module.exports = router;
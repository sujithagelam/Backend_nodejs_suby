const venderController = require("../controllers/venderController");
const express = require("express");
const router = express.Router();
router.post("/register", venderController.vendorRegister);
router.post("/login", venderController.vendorLogin);
router.get("/all-vendors", venderController.getAllvendors);
router.get("/single-vendor/:id", venderController.getVendorById);
module.exports = router;

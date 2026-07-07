const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.secretKey;
const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const venderEmail = await Vendor.findOne({ email });
    if (venderEmail) {
      return res.status(400).json("Email already taken");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
    await newVendor.save();
    res.status(201).json({ message: "vendor registerd succsfull" });
    console.log("registered");
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};
const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });
    console.log(vendor);
    if (!vendor || !(await bcrypt.compare(password, vendor.password)))
      return res.status(401).json({ err: "Invalid username or password" });
    const token = jwt.sign({ vendorId: vendor._id }, secretKey, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({ success: "Login succsful", token, vendorId: vendor._id, vendor });
    console.log(token);
    console.log(email);
  } catch (err) {
    console.log(err.message);
  }
};
const getAllvendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    res.json({ vendors });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};
const getVendorById = async (req, res) => {
  const vendorId = req.params.id;
  try {
    const vendor = await Vendor.findById(vendorId).populate("firm");
    if (!vendor) {
      return res.status(404).json({ error: "vender not found" });
    }
    console.log(vendor);
    const vendorFirmId = vendor.firm[0]._id;
    res.status(200).json({ vendor, vendorFirmId });
    console.log(vendor, vendorFirmId);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
module.exports = { vendorRegister, vendorLogin, getAllvendors, getVendorById };

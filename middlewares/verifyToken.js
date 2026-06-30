const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretKey = process.env.secretKey;
//midlleware takes 3 parameres
const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ error: "Token is require" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.vendorId = decoded.vendorId;
    const vendor = await Vendor.findById(decoded.vendorId);
    if (!vendor) {
      return res.status(404).json({ error: "vendor not found" });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;

const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require("multer");
const Path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + Path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "no firm found" });
    }
    const products = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image,
      firm: firm._id,
    });
    const savedProduct = await products.save();
    firm.product.push(savedProduct);
    await firm.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res(404).json({ error: "No firm found" });
    }
    const restarentname = firm.firstname;
    const products = await Product.find({ firm: firmId });
    res.status(200).json({ restarentname, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

const deleteProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deleteProductId = await Product.findByIdAndDelete(productId);
    if (!deleteProductId) {
      return res.status(400).json({ error: "No product found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};
module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductId,
};

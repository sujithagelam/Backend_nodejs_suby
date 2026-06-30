const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
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
const addFirm = async (req, res) => {
  try {
    const { firstname, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      res.status(404).json({ message: "vendor not found" });
    }
    const firm = new Firm({
      firstname,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });
    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm);
    await vendor.save();

    return res.status(200).json({ message: "firm added succefully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deleteFirmId = await Product.findByIdAndDelete(firmId);
    if (!deleteFirmId) {
      return res.status(400).json({ error: "No product found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };

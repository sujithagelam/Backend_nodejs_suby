const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const vendorRoutes = require("./routes/venderRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB Error:");
    console.error(err.name);
    console.error(err.message);
    console.error(err);
  });
app.use(cors());
app.use(bodyparser.json());
app.use("/vendor", vendorRoutes);
const PORT = process.env.PORT || 4000;
app.use("/", (req, res) => {
  res.send("welcome to suby");
});
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log("server  started and running on port", PORT);
});

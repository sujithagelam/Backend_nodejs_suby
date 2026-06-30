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

dotenv.config();
app.use(cors());
mongoose
  .connect("mongodb://localhost:27017/swiggy")
  .then(() => console.log("mongo db connected sucesssfully"))
  .catch((err) => console.log(err));
app.use(bodyparser.json());
app.use("/vendor", vendorRoutes);
const PORT = 4000;
app.use("/home", (req, res) => {
  res.send("welcome to suby");
});
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log("server  started and running on port", PORT);
});

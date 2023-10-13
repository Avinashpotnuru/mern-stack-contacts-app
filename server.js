const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

mongoose
  .connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connect"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/", require("./routes/contact"));

app.listen(4000, () => console.log("your server is started"));

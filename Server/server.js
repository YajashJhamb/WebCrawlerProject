const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 5000;
const test2 = require("./test2.js");

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db)
  .then(() => console.log("database connected"))
  .catch(er => console.log(err));

app.use("/", test2);

app.listen(port, () => console.log(`Server running on port ${port}`));

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Setting up schema

const URLSchema = new Schema({
  URL: {
    type: String
  }
});

module.exports = URLmodel = mongoose.model("urlDB", URLSchema);

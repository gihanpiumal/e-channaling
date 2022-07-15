const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  doctorID: String,
});

module.exports = mongoose.model("Most_Populor_Doctors", userSchema);

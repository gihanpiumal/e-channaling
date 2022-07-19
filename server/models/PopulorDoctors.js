const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  doctorID: String,
  firstName: String,
  lastName: String,
  avatarFile: String,
  specialization: String,
  gender: String,
  description:String
});

module.exports = mongoose.model("Most_Populor_Doctors", userSchema);

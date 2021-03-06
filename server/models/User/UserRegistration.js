const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  avatarFile: String,
  age: Number,
  address: String,
  phone: Number,
  email: String,
  gender: String,
  userRoleId: String,
  specializationId: String,
  education: String,
  highEducation: String,
  availableAt: String,
  description: String,
  userName: String,
  password: String,
});

module.exports = mongoose.model("User_Registration", userSchema);

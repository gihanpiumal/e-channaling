const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userRoleName: String,
    accessLevel: Number
});

module.exports = mongoose.model("User_Roles", userSchema);

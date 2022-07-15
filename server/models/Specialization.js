const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    specializationName: String
});

module.exports = mongoose.model("specialization", userSchema);

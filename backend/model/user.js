const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  role: String,
  status: {type:String, required :true}
});

module.exports = mongoose.model("User", userSchema);


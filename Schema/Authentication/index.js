const mongoose = require('mongoose');
const crypto = require("crypto");
mongoose.set("strictQuery", false);


const userBasedSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  friendList: [
    { type: String }
  ],
  requestSend: [
    { type: String }
  ],
  followers: [{ type: String }],
  password: {
    type: String,
    require: true,
  },
  salt: String,
  image: String,
  Date: {
    type: Date,
    default: Date.now()
  }
});

userBasedSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`)
}

userBasedSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`)

  return this.password === hash
}

const User = (module.exports = new mongoose.model("chatingAppUser", userBasedSchema))
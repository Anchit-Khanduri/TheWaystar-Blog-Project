
const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const bcrypt = require("bcrypt");
const {createTokenForUser} = require("../controller/userAuth");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    useremail: {
        type: String,
        required: true,
        unique: true
    },
    userpassword: {
        type: String,
        required: true
    },
    userDOB: {
        type: Date,
        required: true
    },
}, {
    timestamps: true
});




// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("userpassword")) return next();

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.userpassword, saltRounds);
    user.userpassword = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});



// login

userSchema.statics.matchPasswordAndGenerateToken = async function (useremail, userpassword) {
  const user = await this.findOne({ useremail });
  if (!user) throw new Error("User not found!");

  const isPasswordValid = await bcrypt.compare(userpassword, user.userpassword);
  if (!isPasswordValid) throw new Error("Incorrect password");

  const token = createTokenForUser(user);
  return token;
};




module.exports = mongoose.model('UserModel', userSchema);






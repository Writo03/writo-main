import mongoose from "mongoose"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: { type: Number },
    profilePic : {
      type : String,
      default : ""
    },
    target: { type: String }, // E.g., JEE or NEET
    institution: { type: String },
    refreshToken: {
      type: String,
    },
    isAdmin : {
      type : Boolean,
      default : false
    },
    isMentor : {
      type : Boolean,
      default : false
    },
    subject : {
      type : String,
    },
    onBreak : {
      type : String,
    },
    onLeave : {
      type : String
    }
  },
  { timestamps: true }
)

// add pre to usemodel bcrypt the password if the password is modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  )
}

const User = mongoose.model("User", UserSchema)

export default User

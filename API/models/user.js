//import { Schema, model } from "mongoose";
const { hash, compare } = require("bcrypt");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: Object,
      uri: String,
      publicId: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};
//module.exports.User = model("User", userSchema);

module.exports = model("User", userSchema);

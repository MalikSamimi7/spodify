const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const emailVerificationTokenSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, //seconds =1hr
    default: Date.now(),
  },
});

emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

emailVerificationTokenSchema.methods.compareToken = async function (token) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = model("EmailVerificationToken", emailVerificationTokenSchema);

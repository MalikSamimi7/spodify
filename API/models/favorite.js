const { Schema, models, model } = require("mongoose");

const favoriteSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  items: [{ type: Schema.Types.ObjectId, ref: "Audio" }],
});

module.exports = models.Favorite || model("Favorite", favoriteSchema);

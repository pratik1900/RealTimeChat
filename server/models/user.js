const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/pratik2/image/upload/v1600430288/realtimechat/default-user-image_o3qrpf.png",
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pendingFriendRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentFriendRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
});

module.exports = mongoose.model("User", userSchema);

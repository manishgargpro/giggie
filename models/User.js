const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firebaseId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  comments: [{
    type: Schema.ObjectId,
    ref: "Comment"
  }],
  gigs: [{
    type: Schema.ObjectId,
    ref: "Gig"
  }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  commentorId: {
    type: Schema.ObjectId,
    ref: "User"
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

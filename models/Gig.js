const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GigSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  workerId: {
    type: Schema.ObjectId,
    ref: "User"
  },
  authorId: {
    type: Schema.ObjectId,
    ref: "User"
  },
  completedDate: {
    type: Date,
    required: false
  },
  comments: [{
    type: Schema.ObjectId,
    ref: "Comment"
  }]
});

const Gig = mongoose.model("Gig", GigSchema);

module.exports = Gig;

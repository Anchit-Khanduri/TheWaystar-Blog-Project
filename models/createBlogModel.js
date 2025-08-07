const mongoose = require("mongoose");
const { Schema} = require("mongoose");

/*
  This is event schema that has data that will be uploaded by the user
*/

const blogData = new mongoose.Schema(
  {
    blogName: {
      type: String,
    },
    blogDescription: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  { timestamps: true }
);

const EventData= mongoose.model("userBlog", blogData);

module.exports = EventData;

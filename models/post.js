import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const post = mongoose.model("Post", postSchema);

export default post;

import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    fileId: String,
    name: String,
    size: Number,
    filePath: String,
    url: String,
    fileType: String,
    width: Number,
    height: Number,
    tags: [String],
    username: String,
  },
  {
    strict: false,
    timestamps: true,
  }
);

Schema.virtual("users", {
  ref: "User",
  localField: "username",
  foreignField: "username",
});

export default mongoose.model("Image", Schema);

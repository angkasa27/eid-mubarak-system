import mongoose from "mongoose";

const ImagesSchema = new mongoose.Schema(
  {
    fileName: String,
    fileUrl: String,
    filePath: String,
    size: Number,
    mime: String,
    type: String,
  },
  {}
);

const Schema = mongoose.Schema(
  {
    imageId: mongoose.Schema.Types.ObjectId,
    link: String,
    images: [ImagesSchema],
  },
  {
    timestamps: true,
  }
);

Schema.virtual("cards", {
  ref: "Card",
  localField: "link",
  foreignField: "link",
});

export default mongoose.model("Image", Schema);

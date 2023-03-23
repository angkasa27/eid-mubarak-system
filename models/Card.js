import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
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
  },
  { strict: false }
);

const DataSchema = new mongoose.Schema(
  {
    image: {
      type: ImageSchema,
    },
    name: String,
    message: String,
    quotes: String,
  },
  { strict: false }
);

const Schema = mongoose.Schema(
  {
    link: String,
    username: String,
    data: {
      type: DataSchema,
    },
    theme: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

Schema.virtual("users", {
  ref: "User",
  localField: "username",
  foreignField: "username",
});

export default mongoose.model("Card", Schema);

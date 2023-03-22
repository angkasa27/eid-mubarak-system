import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    image: String,
    name: String,
    message: String,
    quotes: String,
  },
  { strict: false }
);

const Schema = mongoose.Schema(
  {
    cardId: mongoose.Schema.Types.ObjectId,
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
  localField: "userId",
  foreignField: "username",
});

export default mongoose.model("Card", Schema);

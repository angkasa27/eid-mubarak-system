import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    name: String,
    age: String,
    message: String,
  },
  { strict: false }
);

const ConfigSchema = new mongoose.Schema(
  {
    color: String,
    baseColor: String,
    label: String,
  },
  { strict: false }
);

const Schema = mongoose.Schema(
  {
    cardId: mongoose.Schema.Types.ObjectId,
    link: String,
    data: {
      type: DataSchema,
    },
    config: {
      type: ConfigSchema,
    },
    type: String,
    theme: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    userId: String,
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

import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    username: String,
    name: String,
    message: String,
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

export default mongoose.model("Comment", Schema);

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import ROLE, { ALL_ROLE } from "../constants/role.js";

const Schema = mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: [...ALL_ROLE],
      default: ROLE.USER,
    },
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

Schema.plugin(mongoosePaginate);

export default mongoose.model("User", Schema);

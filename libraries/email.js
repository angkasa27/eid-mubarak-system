import User from "../models/User.js";

export const isEmailExist = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return false;
  return true;
};

export const isEmailExistWithUserId = async (email, id) => {
  const user = await User.findOne({ email, _id: { $ne: id } });
  if (!user) return false;
  return true;
};

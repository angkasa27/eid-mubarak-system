import User from "../models/User.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

export const isUsernameExist = async (username) => {
  const user = await User.findOne({ username });
  if (!user) return false;
  return true;
};

export const getUsername = async (req) => {
  const userAuth = await jsonwebtoken.verify(
    req.headers.authorization.split(" ")[1],
    env.JWT_ACCESS_TOKEN_SECRET
  );
  return userAuth.username;
};

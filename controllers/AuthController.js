import User from "../models/User.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { isUsernameExist } from "../libraries/username.js";

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return jsonwebtoken.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_LIFE,
  });
};

const generateRefreshToken = async (payload) => {
  return jsonwebtoken.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_LIFE,
  });
};

const register = async (req, res) => {
  try {
    const { username, password, retype_password, email, phone } = req.body;

    if (!username) throw { code: 428, message: "username is required" };
    if (!password) throw { code: 428, message: "password is required" };
    if (!retype_password)
      throw { code: 428, message: "retype_password is required" };

    if (password !== retype_password)
      throw { code: 428, message: "PASSWORD_NOT_MATCH" };

    let usernameExist = await isUsernameExist(username);
    if (usernameExist) throw { code: 409, message: "USERNAME_EXIST" };

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hash,
      email,
      phone,
    });

    const user = await newUser.save();

    if (!user) throw { code: 500, message: "USER_REGISTER_FAILED" };

    const payload = { _id: user._id, role: user.role, username: user.username };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    return res.status(200).json({
      status: true,
      data: {
        accessToken,
        refreshToken,
        username: user.username,
      },
      message: "Berhasil mendaftar",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) throw { code: 428, message: "username is required" };
    if (!password) throw { code: 428, message: "password is required" };

    const user = await User.findOne({ username });
    if (!user)
      throw { code: 400, message: "Username atau Password anda salah" };

    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch)
      throw { code: 400, message: "Username atau Password anda salah" };

    const payload = { _id: user._id, role: user.role, username: user.username };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    return res.status(200).json({
      status: true,
      data: {
        accessToken,
        refreshToken,
        username,
      },
      message: "LOGIN_SUCCESS",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    if (!req.body.refreshToken)
      throw { code: 428, message: "REFRESH_TOKEN_REQUIRED" };

    const verify = await jsonwebtoken.verify(
      req.body.refreshToken,
      env.JWT_REFRESH_TOKEN_SECRET
    );

    const payload = {
      _id: verify._id,
      role: verify.role,
      username: verify.username,
    };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    return res.status(200).json({
      status: true,
      data: {
        accessToken,
        refreshToken,
        message: "REFRESH_TOKEN_SUCCESS",
      },
    });
  } catch (err) {
    switch (err.message) {
      case "jwt expired":
        err.message = "REFRESH_TOKEN_EXPIRED";
        break;
      default:
        err.message = "REFRESH_TOKEN_INVALID";
        break;
    }
    if (!err.code) err.code = 401;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export default { register, login, refreshToken };

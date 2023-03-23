import { getUsername } from "../libraries/username.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";
import Image from "../models/Image.js";

const env = dotenv.config().parsed;

const imagekit = new ImageKit({
  publicKey: `${env.IMAGEKIT_PUBLIC_KEY}=`,
  privateKey: `${env.IMAGEKIT_PRIVATE_KEY}=`,
  urlEndpoint: `${env.IMAGEKIT_URL_ENDPOINT}`,
});

const update = async (req, res) => {
  try {
    if (!req.params.username)
      throw { code: 428, message: "Username is required" };

    const username = await getUsername(req);

    if (req.params.username !== username)
      throw { code: 401, message: "unauthorized" };

    const data = req.body;

    if (!data) throw { code: 428, message: "image is required" };

    const image = await Image.findOneAndUpdate(
      { username },
      { ...data, username },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      status: true,
      data: image,
      message: "UPDATE_CARD_SUCCESS",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const drop = async (req, res) => {
  try {
    if (!req.params.username)
      throw { code: 428, message: "Username is required" };
    if (!req.query.fileId) throw { code: 428, message: "fileId is required" };

    await imagekit.deleteFile(req.query.fileId).catch((error) => {
      console.log(error);
    });

    await Image.findOneAndDelete({ username: req.params.username });

    return res.status(200).json({
      status: true,
      message: "DELETE_CARD_SUCCESS",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const auth = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    return res.send(result);
  } catch (error) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export default { update, drop, auth };

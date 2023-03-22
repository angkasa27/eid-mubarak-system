import Image from "../models/Image.js";
import dotenv from "dotenv";
import axios from "axios";

const env = dotenv.config().parsed;

const update = async (req, res) => {
  try {
    const { link } = req.params;
    if (!link) throw { code: 428, message: "link is required" };

    if (!req?.body?.images) throw { code: 428, message: "images is required" };

    const fields = {
      link,
      images: req.body.images,
    };

    const image = await Image.findOneAndUpdate({ link }, fields, {
      new: true,
    });

    if (!image) throw { code: 500, message: "UPDATE_IMAGE_FAILED" };

    return res.status(200).json({
      status: true,
      data: image?._doc?.images,
      message: "UPDATE_IMAGE_SUCCESS",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const removeImage = async (req, res) => {
  try {
    const { link } = req.params;
    const { filePath } = req.query;
    if (!link) throw { code: 428, message: "link is required" };
    if (!filePath) throw { code: 428, message: "filePath is required" };

    const url = `https://api.upload.io/v2/accounts/${env.UPLOAD_ACCOUNT_ID}/files`;

    const result = await axios({
      method: "DELETE",
      url,
      params: {
        filePath,
      },
      headers: {
        Authorization: `Bearer ${env.UPLOAD_API_KEY}`,
      },
    });

    const image = await Image.findOne({ link });

    if (!image) throw { code: 500, message: "REMOVE_IMAGE_FAILED" };

    const newImages = image.images.filter((img) => img.filePath !== filePath);

    const fields = {
      link,
      images: newImages,
    };

    const newImage = await Image.findOneAndUpdate({ link }, fields, {
      new: true,
    });

    if (!newImage) throw { code: 500, message: "REMOVE_IMAGE_FAILED" };

    return res.status(200).json({
      status: true,
      data: newImage?.images,
      message: "REMOVE_IMAGE_SUCCESS",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export default { update, removeImage };

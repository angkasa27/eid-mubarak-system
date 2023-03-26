import Card from "../models/Card.js";
import Image from "../models/Image.js";
import { getUsername } from "../libraries/username.js";

const updateTheme = async (req, res) => {
  try {
    if (!req.params.username) throw { code: 428, message: "Id is required" };
    const { link, theme, variant } = req.body;

    if (!link) throw { code: 428, message: "link is required" };
    if (!theme) throw { code: 428, message: "theme is required" };
    if (!variant) throw { code: 428, message: "variant is required" };

    const username = await getUsername(req);

    if (req.params.username !== username)
      throw { code: 401, message: "unauthorized" };

    const fields = {
      link,
      username,
      theme,
      variant,
    };

    const card = await Card.findOneAndUpdate({ username }, fields, {
      new: true,
      upsert: true,
    });

    if (!card) throw { code: 500, message: "FAIL_ADD_CARD" };

    return res.status(200).json({
      status: true,
      data: card,
      message: "ADD_CARD_SUCCESS",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const show = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) throw { code: 428, message: "username is required" };

    const card = await Card.findOne({ username });

    if (!card) throw { code: 404, message: "CARD_NOT_FOUND" };

    const image = await Image.findOne({ username });

    return res.status(200).json({
      status: true,
      data: { ...card._doc, image: image },
      message: "GET_CARD_SUCCESS",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const updateData = async (req, res) => {
  try {
    if (!req.params.username) throw { code: 428, message: "Id is required" };

    const { data, variant } = req.body;

    if (!data) throw { code: 428, message: "data is required" };
    if (!variant) throw { code: 428, message: "variant is required" };

    const username = await getUsername(req);

    if (req.params.username !== username)
      throw { code: 401, message: "unauthorized" };

    const fields = {
      data,
      variant,
    };

    const card = await Card.findOneAndUpdate({ username }, fields, {
      new: true,
    });

    if (!card) throw { code: 500, message: "UPDATE_CARD_FAILED" };

    return res.status(200).json({
      status: true,
      data: card,
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

export default { show, updateTheme, updateData };

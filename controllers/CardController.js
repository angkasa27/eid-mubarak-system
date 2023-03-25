import Card from "../models/Card.js";
import Image from "../models/Image.js";
import { isLinkExist } from "../libraries/link.js";
import { getUsername } from "../libraries/username.js";

const store = async (req, res) => {
  try {
    const { link, data, theme, variant } = req.body;

    if (!link) throw { code: 428, message: "link is required" };
    if (!data) throw { code: 428, message: "data is required" };
    if (!theme) throw { code: 428, message: "theme is required" };
    if (!variant) throw { code: 428, message: "variant is required" };

    let linkExist = await isLinkExist(link);
    if (linkExist) throw { code: 409, message: "LINK_EXIST" };

    const username = await getUsername(req);

    const newCard = new Card({
      link,
      username,
      data,
      theme,
      variant,
    });

    const card = await newCard.save();

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

const update = async (req, res) => {
  try {
    if (!req.params.username) throw { code: 428, message: "Id is required" };

    const { data, theme, variant } = req.body;

    if (!data) throw { code: 428, message: "data is required" };
    if (!theme) throw { code: 428, message: "theme is required" };
    if (!variant) throw { code: 428, message: "variant is required" };

    const username = await getUsername(req);

    if (req.params.username !== username)
      throw { code: 401, message: "unauthorized" };

    const fields = {
      data,
      theme,
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

export default { store, show, update };

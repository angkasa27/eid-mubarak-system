import Card from "../models/Card.js";
import Image from "../models/Image.js";
import { isLinkExist } from "../libraries/link.js";
import { getUsername } from "../libraries/username.js";

const store = async (req, res) => {
  try {
    const { link, data, config, type, theme } = req.body;

    if (!type) throw { code: 428, message: "type is required" };
    if (!theme) throw { code: 428, message: "theme is required" };
    if (!link) throw { code: 428, message: "link is required" };
    if (!data) throw { code: 428, message: "data is required" };
    if (!config) throw { code: 428, message: "config is required" };

    let linkExist = await isLinkExist(link);
    if (linkExist) throw { code: 409, message: "LINK_EXIST" };

    const username = await getUsername(req);

    const newCard = new Card({
      link,
      data,
      config,
      type,
      theme,
      userId: username,
    });

    const card = await newCard.save();

    if (!card) throw { code: 500, message: "FAIL_ADD_CARD" };

    const newImage = new Image({
      link,
      images: [],
    });

    const image = await newImage.save();

    if (!image) throw { code: 500, message: "FAIL_ADD_IMAGE" };

    return res.status(200).json({
      status: true,
      data: {
        ...card._doc,
        images: image?.images,
      },
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
    const { link } = req.params;

    if (!link) throw { code: 428, message: "link is required" };

    const card = await Card.findOne({ link });
    const image = await Image.findOne({ link });

    return res.status(200).json({
      status: true,
      data: {
        ...card._doc,
        images: image?.images,
      },
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
    if (!req.params.id) throw { code: 428, message: "Id is required" };

    const { data, config, type, theme, userId, link } = req.body;

    if (!type) throw { code: 428, message: "type is required" };
    if (!theme) throw { code: 428, message: "theme is required" };

    const username = await getUsername(req);

    if (userId !== username) throw { code: 401, message: "unauthorized" };

    const fields = {
      data,
      config,
      type,
      theme,
    };

    const card = await Card.findByIdAndUpdate(req.params.id, fields, {
      new: true,
    });

    if (!card) throw { code: 500, message: "UPDATE_CARD_FAILED" };

    const image = await Image.findOne({ link });

    return res.status(200).json({
      status: true,
      data: {
        ...card._doc,
        images: image?.images,
      },
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

const index = async (req, res) => {
  try {
    const username = await getUsername(req);

    const cards = await Card.find({ userId: username });

    if (!cards) throw { code: 500, message: "Get card failed" };

    return res.status(200).json({
      status: true,
      data: cards,
      total: cards.length,
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export default { store, show, update, index };

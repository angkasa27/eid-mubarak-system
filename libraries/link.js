import Card from "../models/Card.js";

export const isLinkExist = async (link) => {
  const card = await Card.findOne({ link });
  if (!card) return false;
  return true;
};

export const isLinkExistWithCardId = async (link, id) => {
  const card = await Card.findOne({ link, _id: { $ne: id } });
  if (!card) return false;
  return true;
};

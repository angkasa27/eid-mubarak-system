import express from "express";
import auth from "./auth.js";
import user from "./user.js";
import card from "./card.js";
import image from "./image.js";
import comment from "./comment.js";

var router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/card", card);
router.use("/image", image);
router.use("/comment", comment);

export default router;

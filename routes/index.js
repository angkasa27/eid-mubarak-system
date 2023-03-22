import express from "express";
import auth from "./auth.js";
import user from "./user.js";
import card from "./card.js";

var router = express.Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/card", card);

export default router;

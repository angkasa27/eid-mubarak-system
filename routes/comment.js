import express from "express";
import CommentController from "../controllers/CommentController.js";

var router = express.Router();

router.get("/:username", [], CommentController.index);
router.post("/:username", [], CommentController.store);

export default router;

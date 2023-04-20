import express from "express";
import CommentController from "../controllers/CommentController.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

var router = express.Router();

router.get("/:username", [], CommentController.index);
router.post("/:username", [], CommentController.store);
router.put("/remove/:id", [jwtAuth()], CommentController.hide);

export default router;

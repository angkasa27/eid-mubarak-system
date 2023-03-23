import express from "express";
import ImageController from "../controllers/ImageController.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

var router = express.Router();

router.put("/:username", [jwtAuth()], ImageController.update);
router.delete("/:username", [jwtAuth()], ImageController.drop);
router.get("/auth", ImageController.auth);

export default router;

import express from "express";
import ImageController from "../controllers/ImageController.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";
// import multer from "multer";

// const upload = multer();

var router = express.Router();

router.put(
  "/:link",
  // [jwtAuth(), upload.single("images")],
  [jwtAuth()],
  ImageController.update
);
router.delete("/:link", [jwtAuth()], ImageController.removeImage);

export default router;

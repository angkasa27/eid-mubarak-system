import express from "express";
import UserController from "../controllers/UserController.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

var router = express.Router();

router.get("/:username", [jwtAuth()], UserController.show);
export default router;

import express from "express";
import CardController from "../controllers/CardController.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

var router = express.Router();

router.get("/:username", CardController.show);
router.get("/detail/:username", [jwtAuth()], CardController.show);
router.put("/theme/:username", [jwtAuth()], CardController.updateTheme);
router.put("/:username", [jwtAuth()], CardController.updateData);

export default router;

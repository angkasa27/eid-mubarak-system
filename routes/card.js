import express from "express";
import CardController from "../controllers/CardController.js";
import { jwtAuth } from "../middlewares/jwtAuth.js";

var router = express.Router();

router.get("/:link", CardController.show);
router.post("/", [jwtAuth()], CardController.store);
router.put("/:link", [jwtAuth()], CardController.update);

export default router;

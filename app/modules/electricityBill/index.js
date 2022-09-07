import { Router } from "express";
import { joiValidator } from "iyasunday";
import { guard } from "../../utils/middleware";
import * as controller from "./controller";
import validation from "./validation";

const router = Router();

//Auth
router.post("/auth", guard(), controller.getToken);
router.post("/pin", guard(), controller.getEncryptedPin);
router.post("/wallet", guard(), controller.getWallet);

//Electricity-Bill
router.post("/validateMeter", guard(), controller.validateMeter);
router.post("/payment", guard(), controller.payment);



export default router;

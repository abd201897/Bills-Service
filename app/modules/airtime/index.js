import { Router } from "express";
import { joiValidator } from "iyasunday";
import { guard } from "../../utils/middleware";
import * as controller from "./controller";
import validation from "./validation";

const router = Router();

//GET AIRTIME BALANCE
router.get("/balance", guard(), controller.getbalance);

//PURCHASE AIRTIME BALANCE
router.post(
  "/purchase",
  guard(),
  joiValidator(validation.purchaseairtime),
  controller.purchaseairtime
);



export default router;

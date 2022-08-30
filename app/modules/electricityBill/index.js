import { Router } from "express";
import { joiValidator } from "iyasunday";
import { guard } from "../../utils/middleware";
import * as controller from "./controller";
import validation from "./validation";

const router = Router();

//GET Electricity BILL
router.get("/balance", guard(), controller.getElecticityBill);
//POST PURCHASE DATA
router.post("/purchase", guard(), joiValidator(validation.purchasedata) , controller.payElectricityBill);


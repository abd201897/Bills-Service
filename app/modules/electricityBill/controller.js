import * as service from "./service";

export async function getElecticityBill(req, res, next) {
  try {
    return res.status(200).json(await service.getElecticityBill(req.user));
  } catch (err) {
    next(err);
  }
}

export async function payElectricityBill(req, res, next) {
  try {
    return res.status(200).json(await service.payElectricityBill(req.user, req.body));
  } catch (err) {
    next(err);
  }
}

import * as serviceAuth from "./serviceAuth"
import * as serviceElectricity from "./serviceElectricity"

//AUTH
export async function getToken(req, res, next) {
  try {
    return res.status(200).json(await serviceAuth.getToken(req.body));
  } catch (err) {
    next(err);
  }
}

export async function getEncryptedPin(req, res, next) {
  try {
    return res.status(200).json(await serviceAuth.getEncryptedPin(req.body));
  } catch (err) {
    next(err);
  }
}

export async function getWallet(req, res, next) {
  try {
    return res.status(200).json(await serviceAuth.getWallet(req.body));
  } catch (err) {
    next(err);
  }
}

//ElectricityBill
export async function validateMeter(req, res, next) {
  try {
    const { token, signature } = req.headers
    return res.status(200).json(await serviceElectricity.validateMeter(req.body , token , signature));
  } catch (err) {
    next(err);
  }
}
export async function payment(req, res, next) {
  try {
    const { token, signature } = req.headers
    return res.status(200).json(await serviceElectricity.payment(req.body , token , signature));
  } catch (err) {
    next(err);
  }
}






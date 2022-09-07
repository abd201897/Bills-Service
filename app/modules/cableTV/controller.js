import * as service from "./service";

export async function getCableTVBill(req, res, next) {
  try {
    return res.status(200).json(await service.getCableTVBill(req.user));
  } catch (err) {
    next(err);
  }
}

export async function payCableTvBill(req, res, next) {
  try {
    return res.status(200).json(await service.payCableTvBill(req.user, req.body));
  } catch (err) {
    next(err);
  }
}

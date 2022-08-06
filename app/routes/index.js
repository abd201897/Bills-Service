import airtime from "../modules/airtime/index";
import data from "../modules/data/index.js";

export default (app) => {
  const version = "/billmgt/v1";
  app.use(`${version}/airtime`, airtime);
  app.use(`${version}/data`, data);

  app.use((err, req, res, next) => {
    if (err) {
      res.status(err.httpStatusCode || 500).json({ message: err.message });
    }
    return next();
  });

  app.use((req, res) => {
    res.status(404).json({
      message: `Requested route ( ${req.get("HOST")}${
        req.originalUrl
      } ) not found`,
    });
  });
};

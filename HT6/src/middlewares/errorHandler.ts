import logger from "../services/logger.service";

export const errorHandler = (err: Error, req, res, next) => {
  logger.error(JSON.stringify({
    method: req.method,
    arguments: {
      params: req.params,
      body: req.body,
      query: req.query
    },
    error: err.message
  }));
  res.status(500).send();
};

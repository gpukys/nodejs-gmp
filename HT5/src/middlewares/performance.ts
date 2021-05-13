import logger from "../services/logger.service";

export const perfMonitor = (req, res, next) => {
  const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
  };
  const start = process.hrtime();

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start)
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage} | ${durationInMilliseconds.toLocaleString()} ms`);
  });
  next();
};

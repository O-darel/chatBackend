const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.headers['x-forwarded-for'] || req.ip;

  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${ip}`);
  console.log(`Headers:`, req.headers);

  if (Object.keys(req.body).length > 0) {
    console.log(`Body:`, req.body);
  }

  next();
};

module.exports = requestLogger;

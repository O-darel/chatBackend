const errorMiddleware = (error, req, res, next) => {
  console.error(error);
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: 'Validation error', errors: error.errors });
  }
  res.status(500).json({ message: error.message || 'Internal server error' });
};

module.exports = errorMiddleware;
/**
 * Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.name || 'ServerError'}:`, err.message);
  
  if (err.stack && process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || err.status || 500;
  
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: `Route not found - ${req.originalUrl}` });
};

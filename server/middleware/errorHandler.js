/**
 * errorHandler.js – Central error-handling middleware.
 * Attach at the bottom of the Express app via: app.use(errorHandler)
 */

export function errorHandler(err, req, res, _next) {
  const status  = err.status  ?? 500;
  const message = err.message ?? 'Internal Server Error';
  console.error(`[ERROR] ${req.method} ${req.path} →`, message);
  res.status(status).json({ success: false, error: message });
}

/**
 * notFound.js – 404 handler for unmatched routes.
 */
export function notFound(req, res) {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
}

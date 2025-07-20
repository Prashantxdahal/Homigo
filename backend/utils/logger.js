/**
 * Logger utility for consistent logging across the application
 */

/**
 * Request logger middleware
 * Logs incoming HTTP requests with timestamp and method
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Log request body for POST/PUT requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    const safeBody = { ...req.body };
    // Remove sensitive fields
    delete safeBody.password;
    delete safeBody.token;
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(safeBody, null, 2));
  }
  
  next();
};

/**
 * Log info message with timestamp
 * @param {string} message - Message to log
 * @param {object} data - Additional data to log
 */
const logInfo = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ℹ️  ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

/**
 * Log error message with timestamp
 * @param {string} message - Error message to log
 * @param {Error} error - Error object
 */
const logError = (message, error = null) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ ${message}`);
  if (error) {
    console.error(error.stack || error);
  }
};

/**
 * Log warning message with timestamp
 * @param {string} message - Warning message to log
 * @param {object} data - Additional data to log
 */
const logWarning = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] ⚠️  ${message}`);
  if (data) {
    console.warn(JSON.stringify(data, null, 2));
  }
};

/**
 * Log success message with timestamp
 * @param {string} message - Success message to log
 * @param {object} data - Additional data to log
 */
const logSuccess = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ✅ ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

module.exports = {
  requestLogger,
  logInfo,
  logError,
  logWarning,
  logSuccess
};

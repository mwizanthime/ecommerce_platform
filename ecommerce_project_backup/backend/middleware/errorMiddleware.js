// const { ValidationError, DatabaseError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

// /**
//  * Custom Error Classes for different error types
//  */
// class AppError extends Error {
//   constructor(message, statusCode, isOperational = true) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//     this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// class ValidationError extends AppError {
//   constructor(message, errors = []) {
//     super(message, 400);
//     this.errors = errors;
//     this.name = 'ValidationError';
//   }
// }

// class AuthenticationError extends AppError {
//   constructor(message = 'Authentication failed') {
//     super(message, 401);
//     this.name = 'AuthenticationError';
//   }
// }

// class AuthorizationError extends AppError {
//   constructor(message = 'Access denied') {
//     super(message, 403);
//     this.name = 'AuthorizationError';
//   }
// }

// class NotFoundError extends AppError {
//   constructor(resource = 'Resource') {
//     super(`${resource} not found`, 404);
//     this.name = 'NotFoundError';
//   }
// }

// class ConflictError extends AppError {
//   constructor(message = 'Resource already exists') {
//     super(message, 409);
//     this.name = 'ConflictError';
//   }
// }

// class RateLimitError extends AppError {
//   constructor(message = 'Too many requests') {
//     super(message, 429);
//     this.name = 'RateLimitError';
//   }
// }

// /**
//  * Error handling middleware
//  */
// /**
//  * Error handling middleware
//  */
// const errorHandler = (err, req, res, next) => {
//   let error = { ...err };
//   error.message = err.message;

//   // Log error
//   console.error('Error:', {
//     message: err.message,
//     stack: err.stack,
//     url: req.url,
//     method: req.method,
//     body: req.body
//   });

//   // Sequelize Validation Error
//   if (err.name === 'SequelizeValidationError') {
//     const errors = Object.values(err.errors).map(e => ({
//       field: e.path,
//       message: e.message,
//       value: e.value
//     }));
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors
//     });
//   }

//   // Sequelize Unique Constraint Error
//   if (err.name === 'SequelizeUniqueConstraintError') {
//     return res.status(400).json({
//       success: false,
//       message: 'Duplicate entry',
//       error: 'A record with this value already exists'
//     });
//   }

//   // JWT Errors
//   if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid token'
//     });
//   }

//   if (err.name === 'TokenExpiredError') {
//     return res.status(401).json({
//       success: false,
//       message: 'Token expired'
//     });
//   }

//   // Default to 500 server error
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Server Error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// };

// /**
//  * 404 Not Found Middleware
//  */
// const notFound = (req, res, next) => {
//   const error = new Error(`Not found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };

// module.exports = {
//   errorHandler,
//   notFound
// };

// /**
//  * Handle Sequelize Validation Errors
//  */
// const handleSequelizeValidationError = (err) => {
//   const errors = Object.values(err.errors).map(error => ({
//     field: error.path,
//     message: error.message,
//     value: error.value
//   }));

//   return new ValidationError('Validation failed', errors);
// };

// /**
//  * Handle Sequelize Database Errors
//  */
// const handleDatabaseError = (err) => {
//   // Log the original error for debugging
//   console.error('Database Error:', err);

//   return new AppError(
//     'A database error occurred. Please try again later.',
//     500
//   );
// };

// /**
//  * Handle Sequelize Unique Constraint Errors
//  */
// const handleUniqueConstraintError = (err) => {
//   const field = Object.keys(err.fields)[0];
//   const value = err.fields[field];
  
//   return new ConflictError(
//     `${field} '${value}' already exists. Please use a different value.`
//   );
// };

// /**
//  * Handle Sequelize Foreign Key Constraint Errors
//  */
// const handleForeignKeyConstraintError = (err) => {
//   return new AppError(
//     'Cannot perform this operation because related records exist.',
//     400
//   );
// };

// /**
//  * Handle JWT Errors
//  */
// const handleJWTError = () => {
//   return new AuthenticationError('Invalid token. Please log in again.');
// };

// const handleJWTExpiredError = () => {
//   return new AuthenticationError('Your token has expired. Please log in again.');
// };

// /**
//  * Handle Cast Errors (MongoDB)
//  */
// const handleCastError = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };

// /**
//  * Handle Syntax Errors
//  */
// const handleSyntaxError = (err) => {
//   return new AppError('Invalid JSON in request body', 400);
// };

// /**
//  * Log error details
//  */
// const logError = (err, req) => {
//   const errorLog = {
//     timestamp: new Date().toISOString(),
//     method: req.method,
//     url: req.url,
//     ip: req.ip,
//     userAgent: req.get('User-Agent'),
//     error: {
//       name: err.name,
//       message: err.message,
//       stack: err.stack,
//       statusCode: err.statusCode
//     },
//     body: req.body,
//     query: req.query,
//     params: req.params
//   };

//   // In production, log to file or monitoring service
//   if (process.env.NODE_ENV === 'production') {
//     console.error(JSON.stringify(errorLog));
//   } else {
//     // In development, pretty print the error
//     console.error('🚨 Error:', errorLog);
    
//     // Log stack trace for non-operational errors
//     if (!err.isOperational) {
//       console.error('Stack Trace:', err.stack);
//     }
//   }
// };

// /**
//  * Send error response to client
//  */
// const sendErrorResponse = (error, req, res) => {
//   // Default error response
//   const errorResponse = {
//     success: false,
//     message: error.message,
//     ...(error.errors && { errors: error.errors }), // Include validation errors if any
//     ...(process.env.NODE_ENV === 'development' && {
//       stack: error.stack,
//       error: error.name
//     })
//   };

//   // Include additional details for 400 errors
//   if (error.statusCode === 400 && error.errors) {
//     errorResponse.details = error.errors.map(err => ({
//       field: err.field,
//       message: err.message,
//       ...(err.value && { value: err.value })
//     }));
//   }

//   // Send response
//   res.status(error.statusCode || 500).json(errorResponse);
// };

// /**
//  * Async error handler wrapper (to avoid try-catch blocks in controllers)
//  */
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// /**
//  * 404 Not Found Middleware
//  */
// const notFoundHandler = (req, res, next) => {
//   const error = new NotFoundError(`Route ${req.originalUrl} not found`);
//   next(error);
// };

// /**
//  * Global unhandled rejection handler
//  */
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  
//   // In production, you might want to exit the process
//   if (process.env.NODE_ENV === 'production') {
//     process.exit(1);
//   }
// });

// /**
//  * Global uncaught exception handler
//  */
// process.on('uncaughtException', (error) => {
//   console.error('🚨 Uncaught Exception:', error);
  
//   // In production, you might want to exit the process
//   if (process.env.NODE_ENV === 'production') {
//     process.exit(1);
//   }
// });

// module.exports = {
//   errorHandler,
//   notFoundHandler,
//   asyncHandler,
//   AppError,
//   ValidationError: class CustomValidationError extends ValidationError {},
//   AuthenticationError,
//   AuthorizationError,
//   NotFoundError,
//   ConflictError,
//   RateLimitError
// };


/**
 * Custom Error Classes for different error types
 * Using different names to avoid conflicts with Sequelize built-in errors
 */
class ApplicationError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class InputValidationError extends ApplicationError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
    this.name = 'InputValidationError';
  }
}

class AuthError extends ApplicationError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthError';
  }
}

class PermissionError extends ApplicationError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'PermissionError';
  }
}

class ResourceNotFoundError extends ApplicationError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'ResourceNotFoundError';
  }
}

class ConflictError extends ApplicationError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

class RateLimitError extends ApplicationError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  logError(err, req);

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    error = handleSequelizeValidationError(err);
  }

  // Sequelize Database Error
  else if (err.name === 'SequelizeDatabaseError') {
    error = handleDatabaseError(err);
  }

  // Sequelize Unique Constraint Error
  else if (err.name === 'SequelizeUniqueConstraintError') {
    error = handleUniqueConstraintError(err);
  }

  // Sequelize Foreign Key Constraint Error
  else if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = handleForeignKeyConstraintError(err);
  }

  // JWT Errors
  else if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Send error response
  sendErrorResponse(error, req, res);
};

/**
 * Handle Sequelize Validation Errors
 */
const handleSequelizeValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message,
    value: error.value
  }));

  return new InputValidationError('Validation failed', errors);
};

/**
 * Handle Sequelize Database Errors
 */
const handleDatabaseError = (err) => {
  // Log the original error for debugging
  console.error('Database Error:', err);

  return new ApplicationError(
    'A database error occurred. Please try again later.',
    500
  );
};

/**
 * Handle Sequelize Unique Constraint Errors
 */
const handleUniqueConstraintError = (err) => {
  const field = Object.keys(err.fields)[0];
  const value = err.fields[field];
  
  return new ConflictError(
    `${field} '${value}' already exists. Please use a different value.`
  );
};

/**
 * Handle Sequelize Foreign Key Constraint Errors
 */
const handleForeignKeyConstraintError = (err) => {
  return new ApplicationError(
    'Cannot perform this operation because related records exist.',
    400
  );
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => {
  return new AuthError('Invalid token. Please log in again.');
};

const handleJWTExpiredError = () => {
  return new AuthError('Your token has expired. Please log in again.');
};

/**
 * Log error details
 */
const logError = (err, req) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode
    },
    body: req.body,
    query: req.query,
    params: req.params
  };

  // In production, log to file or monitoring service
  if (process.env.NODE_ENV === 'production') {
    console.error(JSON.stringify(errorLog));
  } else {
    // In development, pretty print the error
    console.error('🚨 Error:', errorLog);
    
    // Log stack trace for non-operational errors
    if (!err.isOperational) {
      console.error('Stack Trace:', err.stack);
    }
  }
};

/**
 * Send error response to client
 */
const sendErrorResponse = (error, req, res) => {
  // Default error response
  const errorResponse = {
    success: false,
    message: error.message,
    ...(error.errors && { errors: error.errors }), // Include validation errors if any
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: error.name
    })
  };

  // Include additional details for 400 errors
  if (error.statusCode === 400 && error.errors) {
    errorResponse.details = error.errors.map(err => ({
      field: err.field,
      message: err.message,
      ...(err.value && { value: err.value })
    }));
  }

  // Send response
  res.status(error.statusCode || 500).json(errorResponse);
};

/**
 * Async error handler wrapper (to avoid try-catch blocks in controllers)
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new ResourceNotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Global unhandled rejection handler
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  
  // In production, you might want to exit the process
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

/**
 * Global uncaught exception handler
 */
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  
  // In production, you might want to exit the process
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  ApplicationError,
  InputValidationError,
  AuthError,
  PermissionError,
  ResourceNotFoundError,
  ConflictError,
  RateLimitError
};
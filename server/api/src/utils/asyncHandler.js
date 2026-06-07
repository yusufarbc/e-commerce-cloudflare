/**
 * Wraps an async route handler to automatically catch errors and pass them to the global error handler.
 * eliminating the need for try-catch blocks in every controller method.
 * 
 * @param {Function} fn - The async function to wrap.
 * @returns {Function} Express middleware function.
 */
export const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

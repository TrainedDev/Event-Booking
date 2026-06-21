const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status ||500).json({ message: err.msg || "Internal Server Error" });
}
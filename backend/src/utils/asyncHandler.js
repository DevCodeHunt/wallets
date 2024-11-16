const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (error) {
    next(error)
    // res.status(error.code || 500).json({
    //   status: error.code || 500,
    //   message: error.message || "Internal Server Error",
    // });
  }
};

export default asyncHandler;

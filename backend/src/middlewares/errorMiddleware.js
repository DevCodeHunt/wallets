const errorHandlerMiddleware = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500
  error.message = error.message || "Internal Server Error"

  let message
  // Wrong mongodb id error
  if (error.name === "CastError") {
    message = `Resources not found with this id.. Invalid ${error.path}`
  }

  //Duplicate key error
  else if (error.code === 11000) {
    message = `${Object.keys(error.keyValue)} already exists`
  }

  res.status(error.statusCode).json({
    status: error.statusCode,
    success: false,
    message: error.message,
  })
}

export default errorHandlerMiddleware

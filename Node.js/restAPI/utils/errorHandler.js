const { z } = require("zod");

function createErrorMessage(error) {
  return error.errors.map((err) => ({
    field: err.path[0],
    message: err.message,
  }));
}

function errorHandler(error, req, res, statusCode) {
  let message = "Something went wrong!";
  if (error.name === "CustomValidationError") {
    message = error.message;
    res.status(error.statusCode).json({ message });
  } else if (error instanceof TypeError || error.name == "MongoError" || error.name == "ObjectParameterError") {
    message = error?.message;
    res.status(statusCode).json({ message });
  } else if (error instanceof z.ZodError) {
    message = createErrorMessage(error);
    res.status(422).json({ message });
  } else {
    console.log("needs more work here");
    res.status(statusCode).json({ message });
  }
  console.error(`Error: ${req.method} >> ${req.baseUrl}`, error);
}

module.exports = errorHandler;

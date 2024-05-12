class ValidationError extends Error {
  constructor({ message, statusCode }) {
    super(message);
    this.name = "CustomValidationError";
    this.statusCode = statusCode || 400;
  }
}

module.exports = ValidationError;

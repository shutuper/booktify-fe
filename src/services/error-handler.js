export class ApiError extends Error {
  status = 500;
  timestamp = new Date().toISOString();
  message = "Api error";

  constructor(errorData) {
    super(errorData?.message || "Api Error");
    this.status = errorData?.status || 500;
    this.message = errorData?.message || "Api Error";
    this.timestamp = errorData?.timestamp || new Date().toISOString();
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  serializeError() {
    return { errorType: this.errorType, errors: this.errors };
  }
}

export function handleError(err) {
  if (err instanceof ApiError) {
    return err.serializeError();
  }

  const unknownAppError = new ApiError(
    err?.message || "Unknown Application Error",
  );
  return unknownAppError.serializeError();
}

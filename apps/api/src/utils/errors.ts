export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ServiceError";
    this.statusCode = statusCode;
  }

  static NotFound(message: string) {
    return new ServiceError(message, 404);
  }

  static BadRequest(message: string) {
    return new ServiceError(message, 400);
  }

  static Unauthorized(message: string) {
    return new ServiceError(message, 401);
  }

  static Forbidden(message: string) {
    return new ServiceError(message, 403);
  }
}

export class ApiError extends Error {
  status;
  errors;

  constructor(status: any, message: string, errors: string[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static Unauthorized() {
    return new ApiError(401, 'Пользователь не авторизован');
  }

  static BadRequest(message: string, errors: string[] = []) {
    return new ApiError(400, message, errors);
  }
}
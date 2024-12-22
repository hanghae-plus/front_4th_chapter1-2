export class UnauthorizedError extends Error {
  static MESSAGE = "UnauthorizedError";

  constructor() {
    super(UnauthorizedError.MESSAGE);
  }
}

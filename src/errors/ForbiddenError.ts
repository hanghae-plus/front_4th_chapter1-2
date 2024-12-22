export class ForbiddenError extends Error {
  static MESSAGE = "ForbiddenError";

  constructor() {
    super(ForbiddenError.MESSAGE);
  }
}

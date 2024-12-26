export class NotFoundError extends Error {
  static MESSAGE = "NotFoundError";

  constructor() {
    super(NotFoundError.MESSAGE);
  }
}

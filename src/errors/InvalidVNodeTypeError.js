export class InvalidVNodeTypeError extends Error {
  static MESSAGE = "InvalidVNodeTypeError";

  constructor() {
    super(InvalidVNodeTypeError.MESSAGE);
  }
}

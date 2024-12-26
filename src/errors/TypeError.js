export class TypeError extends Error {
  static MESSAGE = "TypeError";

  constructor() {
    super(TypeError.MESSAGE);
  }
}

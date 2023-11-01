function createCustomError(status: number, message: string) {
  class CustomError extends Error {
    status: number;

    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  }

  return new CustomError(status, message);
}

export default createCustomError;

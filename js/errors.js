class ForbiddenStatusError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "ForbiddenStatusError"; // (2)
  }
}

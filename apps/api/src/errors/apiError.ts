export class APIError extends Error {
  constructor(
    public readonly httpCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

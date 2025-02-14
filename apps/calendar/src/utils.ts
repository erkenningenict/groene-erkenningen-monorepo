export type ErrorResponse = { code: string; message: string };

export function hasCodeProperty(error: unknown): error is ErrorResponse {
  return typeof error === "object" && error !== null && "code" in error;
}

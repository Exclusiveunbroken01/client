// src/lib/utils/errors/api-error.util.ts

export class ApiError<TDetails = unknown> extends Error {
  readonly status: number;
  readonly details?: TDetails;

  constructor(status: number, message: string, details?: TDetails) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

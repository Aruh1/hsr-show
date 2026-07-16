/**
 * Custom error classes for structured error handling across the application.
 * Each error type includes an appropriate HTTP status code for API responses.
 */

/** Base class for application errors with HTTP status codes */
export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 500,
        public readonly code: string = "INTERNAL_ERROR"
    ) {
        super(message);
        this.name = "AppError";
    }
}

/** Validation errors (400 Bad Request) */
export class ValidationError extends AppError {
    constructor(message: string, code: string = "VALIDATION_ERROR") {
        super(message, 400, code);
        this.name = "ValidationError";
    }
}

/** Resource not found errors (404 Not Found) */
export class NotFoundError extends AppError {
    constructor(message: string, code: string = "NOT_FOUND") {
        super(message, 404, code);
        this.name = "NotFoundError";
    }
}

/** External API errors (502 Bad Gateway) */
export class ExternalApiError extends AppError {
    constructor(
        message: string,
        public readonly cause?: Error
    ) {
        super(message, 502, "EXTERNAL_API_ERROR");
        this.name = "ExternalApiError";
    }
}

/** Rate limit errors (429 Too Many Requests) */
export class RateLimitError extends AppError {
    constructor(message: string = "Too many requests") {
        super(message, 429, "RATE_LIMIT");
        this.name = "RateLimitError";
    }
}

/** Timeout errors (504 Gateway Timeout) */
export class TimeoutError extends AppError {
    constructor(message: string = "Request timeout") {
        super(message, 504, "TIMEOUT");
        this.name = "TimeoutError";
    }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
}

/**
 * Get appropriate AppError from unknown error
 */
export function toAppError(error: unknown): AppError {
    if (isAppError(error)) return error;

    if (error instanceof Error) {
        // Check for common error patterns
        if (error.name === "AbortError") {
            return new TimeoutError("Request was aborted");
        }
        return new AppError(error.message);
    }

    return new AppError("An unknown error occurred");
}

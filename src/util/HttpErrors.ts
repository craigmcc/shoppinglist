// HttpErrors ----------------------------------------------------------------

// Classes defining HTTP errors that can be returned by this application.

// HTTP Status Codes ---------------------------------------------------------

export const OK = 200;
export const CREATED = 201;
export const NO_CONTENT = 204;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const NOT_UNIQUE = 409;
export const SERVER_ERROR = 500;

// Base Error Class ----------------------------------------------------------

export type Source = string | Error;

/**
 * Abstract base class for all HTTP errors returned by this application.
 * Developers should use the specific error subclasses for each specific
 * use case.
 *
 * @param source                String message or an Error to be wrapped
 * @param context               (Optional) Additional context for this error
 */
export abstract class HttpError extends Error {

    constructor(source: Source, context?: string) {
        super(source instanceof Error ? source.message : source);
        this.context = context ? context : undefined;
        this.inner = source instanceof Error ? source : undefined;
        this.status = BAD_REQUEST;
    }

    context: string | undefined;
    inner: Error | undefined;
    status: number;

}

// Specific Error Classes ----------------------------------------------------

/**
 * Report a problem processing the input to a service.
 */
export class BadRequest extends HttpError {
    constructor(source: Source, context?: string) {
        super(source, context);
        this.status = BAD_REQUEST;
    }
}

/**
 * Report that a requested operation is not allowed for the requestor.
 */
export class Forbidden extends HttpError {
    constructor(source: Source, context?: string) {
        super(source, context);
        this.status = FORBIDDEN;
    }
}

/**
 * Report that requested information was not found by the provided identifiers.
 */
export class NotFound extends HttpError {
    constructor(source: Source, context?: string) {
        super(source, context);
        this.status = NOT_FOUND;
    }
}

/**
 * Report that a requested insert or update would violate uniqueness constraints.
 */
export class NotUnique extends HttpError {
    constructor(source: Source, context?: string) {
        super(source, context);
        this.status = NOT_UNIQUE;
    }
}

/**
 * Report that an internal server error of some sort has occurred.
 */
export class ServerError extends HttpError {
    constructor(source: Source, context?: string) {
        super(source, context);
        this.status = SERVER_ERROR;
    }
}

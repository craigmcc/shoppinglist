// Helpers -------------------------------------------------------------------

// Miscellaneous helper functions for tests.

// External Modules ----------------------------------------------------------

import {DefaultBodyType, ResponseComposition, RestContext} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpError} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const HttpErrorResponse = (
    res: ResponseComposition<DefaultBodyType>,
    ctx: RestContext,
    error: unknown
) => {
    const httpError = error as HttpError;
    return res(
        ctx.status(httpError.status),
        ctx.json({
            context: httpError.context,
            message: httpError.message,
            status: httpError.status,
        }),
    );
}

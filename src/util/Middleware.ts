// Middleware ----------------------------------------------------------------

// Express middleware functions that can be used to configure
// Router implementations (or the entire application) via use() calls,
// or be included in the processing flow for a particular route.

// External Modules -----------------------------------------------------------

import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
const SequelizeValidationError = require("sequelize");

// Internal Modules ----------------------------------------------------------

import { HttpError } from "./HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Handle HttpError errors by formatting and sending the
 * appropriate HTTP response.
 *
 * @param error                         Error to be handled
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 */
export const handleHttpError: ErrorRequestHandler =
    (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof HttpError) {
            res.status(error.status).send({
                context: error.context ? error.context : undefined,
                // Do *not* include "inner" if present!
                message: error.message,
                status: error.status,
            });
        } else {
            next(error);
        }
    }

/**
 * Handle any error not previously handled.  This ensures that unhandled
 * promise rejection problems actually get handled, and must be the last
 * error handling middleware to be configured.
 *
 * @param error                         Error to be handled
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 */
export const handleServerError: ErrorRequestHandler =
    (error: Error, req: Request, res: Response, next: NextFunction) => {
        console.info("handleServerError: ", error);
        res.status(500).send({
            // Do *not* include "inner" if present!
            message: error.message,
            status: 500
        });
    }

/**
 * Handle ValidationError errors by formatting and sending the
 * appropriate HTTP response.
 *
 * @param error                         Error to be handled
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 */
export const handleValidationError: ErrorRequestHandler =
    (error: typeof SequelizeValidationError, req: Request, res: Response, next: NextFunction) => {
        if (error.name && (error.name === "SequelizeValidationError")) {
            res.status(400).send({
                // Do *not* include "inner" if present!
                message: error.message,
                status: 400,
            });
        } else {
            next(error);
        }
    }

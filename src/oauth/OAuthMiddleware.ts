// OAuthMiddleware -----------------------------------------------------------

// Express middleware to enforce OAuth scope limits.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);

import {InvalidScopeError, OAuthError} from "@craigmcc/oauth-orchestrator";
import {
    ErrorRequestHandler,
    NextFunction,
    Request,
    RequestHandler,
    Response
} from "express";

// Internal Modules ----------------------------------------------------------

import OAuthOrchestrator from "./OAuthOrchestrator";
import AccessToken from "../models/AccessToken";
import User from "../models/User";
import {Forbidden} from "../util/HttpErrors";
import logger from "../util/ServerLogger";

const ADMIN_PERMISSION = "admin";
const AUTHORIZATION_HEADER = "Authorization";
const DATABASE_TOKEN = process.env.DATABASE_TOKEN ? process.env.DATABASE_TOKEN : "";
const NODE_ENV: string | undefined = process.env.NODE_ENV;
const REGULAR_PERMISSION = "regular";
const SUPERUSER_SCOPE = process.env.SUPERUSER_SCOPE ? process.env.SUPERUSER_SCOPE : "superuser";
const TOP_LEVEL_OBJECT_ID = "groupId"; // Top level object ID for this application

let oauthEnabled: boolean = true;
if (process.env.OAUTH_ENABLED !== undefined) {
    oauthEnabled = (process.env.OAUTH_ENABLED === "true");
}
logger.info({
    context: "Startup",
    msg: "Initialize OAuth Access Protection",
    enabled: `${oauthEnabled}`,
    superuserScope: process.env.SUPERUSER_SCOPE,
})

// Public Objects ------------------------------------------------------------

/**
 * Clear the current mappings of top level permissions.  This will trigger a
 * reload of the mappings the next time permissions are checked.
 *
 * This should ONLY be called by a Service object that mutates the current scope
 * of any top level object (including adding or removing such an object).
 */
export const clearMapping = () : void => {
    mapping.clear();
}

/**
 * Dump request details (for debugging only).
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 */
export const dumpRequestDetails: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        logger.info({
            context: "OAuthMiddleware.dumpRequestDetails",
            msg: `${req.method} ${req.url}`,
            baseUrl: `${req.baseUrl}`,
            headers: req.headers,
/*
            authorization: `${req.get("authorization")}`,
            contentLength: `${req.get("Content-Length")}`,
            contentType: `${req.get("Content-Type")}`,
*/
            originalUrl: `${req.originalUrl}`,
            params: `${JSON.stringify(req.params)}`,
            path: `${req.path}`,
            query: `${JSON.stringify(req.query)}`,
            token: `${res.locals.token}`
        });
        next();
    }

/**
 * Handle OAuthError errors by formatting and sending the
 * appropriate HTTP response.
 *
 * @param error                         Error to be handled
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 */
export const handleOAuthError: ErrorRequestHandler =
    (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof OAuthError) {
            res.status(error.status).send({
                context: error.context ? error.context : undefined,
                // Do *not* include "inner" if present!
                message: error.message,
                name: error.name ? error.name : undefined,
                status: error.status ? error.status : undefined,
            });
        } else {
            next(error);
        }
    }

/**
 * Pass this request on if the currently logged in User has "admin"
 * permissions for the libraryId specified in the request.
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 *
 * @throws                              Error if permissions are not present
 */
export const requireAdmin: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if (oauthEnabled) {
            const token = extractToken(req);
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireAdmin"
                );
            }
            const topLevelScope = await mapTopLevelID(req);
            const required = `${topLevelScope}:${ADMIN_PERMISSION}`;
            await authorizeToken(token, required);
            res.locals.token = token;
            next();
        } else {
            next();
        }
    }

/**
 * Pass this request on if the request has a valid access token,
 * no matter what scopes might be allowed or not allowed.
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 *
 * @throws                              Error if valid token is not present
 */
export const requireAny: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (oauthEnabled) {
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireAny"
                );
            }
            const required = "";
            await authorizeToken(token, required);
            res.locals.token = token;
            next();
        } else {
            res.locals.token = token;
            next();
        }
    }

/**
 * Pass this request on if the current request includes the database token.
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 *
 * @throws                              Error if required permission is missing
 */
export const requireDatabase: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if (oauthEnabled) {
            const token = extractToken(req);
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireDatabase"
                );
            }
            if ((DATABASE_TOKEN === "") || (token !== DATABASE_TOKEN)) {
                throw new Forbidden(
                    "Invalid access token presented",
                    "OAuthMiddleware.requireDatabase",
                );
            }
            res.locals.token = token;
            next();
        } else {
            next();
        }
    }

/**
 * Pass this request on even if there is no token provided.  Primarily for
 * self-documentation purposes -- omitting any "requireXxxxx" means the
 * same thing semantically.
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 */
export const requireNone: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        next();
    }

/**
 * Pass this request on if we are *not* in NODE_ENV === "production" mode.
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 *
 * @throws                              Error if we are in production mode
 */
export const requireNotProduction: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if ("production" === NODE_ENV) {
            throw new Forbidden(
                "This request is not allowed in production mode",
                "OAuthMiddleware.requireNotProduction"
            );
        } else {
            next();
        }
    }

/**
 * Pass this request on if the currently logged in User has "admin"
 * permissions for the libraryId specified in the request.
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 *
 * @throws                              Error if permissions are not present
 */
export const requireRegular: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if (oauthEnabled) {
            const token = extractToken(req);
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireRegular"
                );
            }
            const topLevelScope = await mapTopLevelID(req);
            const required = `${topLevelScope}:${REGULAR_PERMISSION}`;
            try {
                await authorizeToken(token, required);
            } catch (error) {
                if (error instanceof InvalidScopeError) {
                    await authorizeToken(token, required.replace("regular","admin"));
                } else {
                    throw error;
                }
            }
            res.locals.token = token;
            next();
        } else {
            next();
        }
    }

/**
 * Pass this request on if the currently logged in User has superuser
 * permissions.
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 *
 * @throws                              Error if required permission is missing
 */
export const requireSuperuser: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if (oauthEnabled) {
            const token = extractToken(req);
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireSuperuser"
                );
            }
            await authorizeToken(token, SUPERUSER_SCOPE);
            res.locals.token = token;
            next();
        } else {
            next();
        }
    }

/**
 * Pass this request on if the request has a valid access token,
 * as in requireAny().  In addition, add the User object of the
 * User associated with the validated token as a local object, for
 * use in subsequent handling.
 *
 * IMPLEMENTATION NOTE:  A valid access token is required, even if
 * oauthEnabled is false, because we must be able to look up the
 * relevant User.
 *
 * @param req                           Current HTTP request
 * @param res                           Current HTTP response
 * @param next                          Next function to handle things after this one
 *
 * @throws                              Error if valid token is not present
 */
export const requireUser: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        // Validate and save the token itself
        const token = extractToken(req);
        if (!token) {
            throw new Forbidden(
                "No access token presented",
                "OAuthMiddleware.requireUser"
            );
        }
        await authorizeToken(token, "");
        res.locals.token = token;

        // Look up and save the User that corresponds to this
        // access token.
        //
        // WARNING: This depends on using the same mechanisms
        // that the authorizeToken() mechanism uses to relate
        // an AccessToken to a User.
        const accessToken = await AccessToken.findOne({
            include: [ User ],
            where: { token: token }
        });
        if (accessToken && accessToken.user) {
            res.locals.user = accessToken.user;
        } else {
            res.locals.user = null;
        }

        // Pass control to the next middleware, as usual
        next();

    }

// Private Objects -----------------------------------------------------------

/**
 * Mapping of top level IDs to the scope prefix required to access this set
 * of objects.  Populated when checked if currently empty.  Cleared when
 * clearMapping() is called.
 */
const mapping = new Map<string, string>();


/**
 * for the specified required scope.  Returns normally if successful.
 *
 * @param token         The access token to be authorized
 * @param required      Required scope for the access token to be used
 *
 * @throws              Error returned by OAuthServer.authorize()
 *                      if token was not successfully authorized
 */
const authorizeToken = async (token: string, required: string): Promise<void> => {
    await OAuthOrchestrator.authorize(token, required);
}

/**
 * Extract and return the presented access token in this request (if any).
 *
 * IMPLEMENTATION NOTE:  We *only* support the "Authorization" header
 * mechanism to receive a bearer token that RFC 6750 defines (Section 2.1).
 *
 * @param req           The HTTP request being processed
 *
 * @returns             Extracted access token (if any) or null
 */
const extractToken = (req: Request) : string | null => {
    const header: string | undefined = req.header(AUTHORIZATION_HEADER);
    if (!header) {
        return null;
    }
    const fields: string[] = header.split(" ");
    if (fields.length != 2) {
        return null;
    }
    if (fields[0] !== "Bearer") {
        return null;
    }
    return fields[1];
}

/**
 * Load the mapping table of top level object IDs to the corresponding
 * scope prefix required for operations on this object.
 */
const loadMapping = async (): Promise<void> => {
    mapping.clear();
/*
    const groups = await GroupServices.all();
    groups.forEach(group => {
        mapping.set(group.id, group.scope.trim());
    });
*/
}

/**
 * Map the top level object ID parameter for this request to a corresponding
 * scope value that must be authorized for the request's access token.
 *
 * @param req           The HTTP request being processed
 *
 * @returns             Scope value to be included (if any)
 */
const mapTopLevelID = async (req: Request): Promise<string | undefined> => {
    if (mapping.size === 0) {
        await loadMapping();
    }
    const objectId: string | null = req.params[TOP_LEVEL_OBJECT_ID]
        ? req.params[TOP_LEVEL_OBJECT_ID]
        : null;
    if (!objectId) {
        return undefined;
    } else {
        return mapping.get(objectId);
    }
}

// EmailRouter ---------------------------------------------------------------

// Express endpoints for email receiving.

// External Modules ----------------------------------------------------------

import {IncomingMail} from "cloudmailin";
import {Request, Response, Router} from "express";
const basicAuth = require("express-basic-auth");

// Internal Modules ----------------------------------------------------------

import EmailServices from "../services/EmailServices";
import {NO_CONTENT} from "../util/HttpErrors";

// Authentication Support ----------------------------------------------------

// Support for receiving email from cloudmailin.com with BASIC authentication
// credentials for a specific username/password combination that is defined
// in environment variables EMAIL_RECEIVE_USERNAME and EMAIL_RECEIVE_PASSWORD.
// If these variables are not set, no authentication will be enforced.
const EMAIL_RECEIVE_PASSWORD =
    process.env.EMAIL_RECEIVE_PASSWORD ? process.env.EMAIL_RECEIVE_PASSWORD : "";
const EMAIL_RECEIVE_USERNAME =
    process.env.EMAIL_RECEIVE_USERNAME ? process.env.EMAIL_RECEIVE_USERNAME : "";

const authorizer = (username: string, password: string) => {
    if ((EMAIL_RECEIVE_USERNAME.length > 0) && (EMAIL_RECEIVE_PASSWORD.length > 0)) {
        return basicAuth.safeCompare(username, EMAIL_RECEIVE_USERNAME)
            && basicAuth.safeCompare(password, EMAIL_RECEIVE_PASSWORD);
    } else {
        return true;
    }
}

// Public Objects ------------------------------------------------------------

export const EmailRouter = Router({
    strict: true,
});

export default EmailRouter;

// Route Definitions ---------------------------------------------------------

// POST /receive - Receive an email message
EmailRouter.post("/receive",
    basicAuth({ authorizer: authorizer }),
    async (req: Request, res: Response) => {
        await EmailServices.receive(<IncomingMail>req.body);
        res.status(NO_CONTENT).send();
    });

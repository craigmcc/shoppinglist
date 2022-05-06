// OAuthMeRouter -------------------------------------------------------------

// Express operations for dealing with the logged in User's profile.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireUser} from "./OAuthMiddleware";
import User from "../models/User";
import {BadRequest, Forbidden} from "../util/HttpErrors";
//import UserServices from "../services/UserServices";

// Public Objects ------------------------------------------------------------

export const OAuthMeRouter = Router({
    strict: true
});

// Retrieve the authenticated User's profile
OAuthMeRouter.get("/",
    requireUser,
    async (req: Request, res: Response) => {
        if (res.locals.user) {
            const user: User = res.locals.user;
            user.password = ""; // Never share passwords, even hashed ones
            res.send(user);
        } else {
            throw new BadRequest(
                "OAuthMeRouter.get",
                "Missing User information"
            );
        }
    });

// Update the authenticated User's profile (with restrictions)
OAuthMeRouter.put("/",
    requireUser,
    async (req: Request, res: Response) => {

        // Did we receive a valid user?
        if (!res.locals.user) {
            throw new Forbidden(
                "No valid User identified",
                "OAuthMeRouter.put"
            );
        }
        const user = res.locals.user;

        // Construct a restricted update disallowing certain changes
        const update: Partial<User> = req.body;
        delete update.id;
        delete update.active;
        delete update.email;
        delete update.scope;
        delete update.username;

        // Perform the restricted update and return the result
/*
        res.send(await UserServices.update(
            user.id,
            update
        ));
*/

    });

export default OAuthMeRouter;

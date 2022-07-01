// PasswordRouter ------------------------------------------------------------

// Limited router required to process requests for Password information.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireUser} from "../oauth/OAuthMiddleware";
import PasswordServices from "../services/PasswordServices";
import {NO_CONTENT} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const PasswordRouter = Router({
    strict: true,
});

export default PasswordRouter;

// Model-Specific Routes -----------------------------------------------------

// POST / - Update password for the current User
PasswordRouter.post("/",
    requireUser,
    async (req: Request, res: Response) => {
        await PasswordServices.update(res.locals.user, req.body);
        return res.sendStatus(NO_CONTENT);
    });

// POST /:email - Send a "forgot my password" message to the specified email
PasswordRouter.post("/:email",
    async (req: Request, res: Response) => {
        await PasswordServices.forgot(req.params.email);
        return res.sendStatus(NO_CONTENT);
    })

// GET /:passwordId - Find Password by ID
PasswordRouter.get("/:passwordId",
    async (req: Request, res: Response) => {
        return res.send(await PasswordServices.find(req.params.passwordId));
    });

// PUT /:passwordId - Update forgotten password
PasswordRouter.put("/:passwordId",
    async (req: Request, res: Response) => {
        return res.send(await PasswordServices.submit(req.body));
    });


// ShareRouter ---------------------------------------------------------------

// Limited router required to process requests for Share information.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireUser} from "../oauth/OAuthMiddleware";
import ShareServices from "../services/ShareServices";

// Public Objects ------------------------------------------------------------

export const ShareRouter = Router({
    strict: true,
});

export default ShareRouter;

// Model-Specific Routes -----------------------------------------------------

// GET /:shareId - Find Share by ID
ShareRouter.get("/:shareId",
    requireUser,
    async (req: Request, res: Response) => {
        return res.send(await ShareServices.find(req.params.shareId));
    });

// POST /:shareId - Accept the specified Share
ShareRouter.post("/:shareId",
    requireUser,
    async (req: Request, res: Response) => {
        return res.send(await ShareServices.accept(req.params.shareId, req.body, res.locals.user));
    });


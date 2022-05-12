// ClientRouter --------------------------------------------------------------

// Router for logging requests from clients.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import ClientServices from "../services/ClientServices";

// Public Objects ------------------------------------------------------------

export const ClientRouter = Router({
    strict: true,
});

ClientRouter.post("/clientLog",
    async (req: Request, res: Response) => {
        await ClientServices.log(req.body);
        res.sendStatus(204);
    })

export default ClientRouter;

// ListRouter ----------------------------------------------------------------

// Express endpoints for List models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireSuperuser} from "../oauth/OAuthMiddleware";
import ListServices from "../services/ListServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const ListRouter = Router({
    strict: true,
});

// TODO - superuser access required for all routes
ListRouter.use(requireSuperuser);

export default ListRouter;

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all matching Lists
ListRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await ListServices.all(
            req.query
        ));
    });

// POST / - Insert a new List
ListRouter.post("/",
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await ListServices.insert(
            req.body
        ));
    });

// DELETE /:listId - Remove List by ID
ListRouter.delete("/:listId",
    async (req: Request, res: Response) => {
        res.send(await ListServices.remove(req.params.listId));
    });

// GET /:listId - Find List by ID
ListRouter.get("/:listId",
    async (req: Request, res: Response) => {
        res.send(await ListServices.find(req.params.listId, req.query));
    });

// PUT /:listId - Update List by ID
ListRouter.put("/:listId",
    async (req: Request, res: Response) => {
        res.send(await ListServices.update(req.params.listId, req.body));
    });

// List-Child Routes ---------------------------------------------------------

// GET /:listId/categories - Find Categories for this List
ListRouter.get("/:listId/categories",
    async (req: Request, res:Response) => {
        res.send(await ListServices.categories(req.params.listId, req.query));
    });

// GET /:listId/items - Find Items for this List
ListRouter.get("/:listId/items",
    async (req: Request, res:Response) => {
        res.send(await ListServices.items(req.params.listId, req.query));
    });

// List-User Routes ----------------------------------------------------------

// GET /:listId/users - Find Users for this List
ListRouter.get("/:listId/users",
    async (req: Request, res: Response) => {
        res.send(await ListServices.users(req.params.listId, req.query));
    });

// DELETE /:listId/users/:listId - Disassociate List and User
ListRouter.delete("/:listId/users/:userId}",
    async (req: Request, res: Response) => {
        res.send(await ListServices.usersExclude(req.params.listId, req.params.userId));
    });

// POST /:listId/users/:listId - Associate List and User
ListRouter.post("/:listId/users/:userId",
    async (req: Request, res: Response) => {
        let admin: boolean = false;
        if (req.query && (req.query.admin === "")) {
            admin = true;
        }
        res.send(await ListServices.usersInclude(req.params.listId, req.params.userId, admin));
    });
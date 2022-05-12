// UserRouter ----------------------------------------------------------------

// Express endpoints for User models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {dumpRequestDetails, requireSuperuser} from "../oauth/OAuthMiddleware";
import UserServices from "../services/UserServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const UserRouter = Router({
    strict: true,
});

// TODO - superuser access required for all routes
UserRouter.use(requireSuperuser);

export default UserRouter;

// Model-Specific Routes (no userId) -----------------------------------------

// GET /exact/:username - Find User by exact username
UserRouter.get("/exact/:username",
    async (req: Request, res: Response) => {
        res.send(await UserServices.exact(
            req.params.username,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all matching Users
UserRouter.get("/",
    dumpRequestDetails,
    async (req: Request, res: Response) => {
        res.send(await UserServices.all(
            req.query
        ));
    });

// POST / - Insert a new User
UserRouter.post("/",
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await UserServices.insert(
            req.body
        ));
    });

// DELETE /:userId - Remove User by ID
UserRouter.delete("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.remove(req.params.userId));
    });

// GET /:userId - Find User by ID
UserRouter.get("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.find(req.params.userId, req.query));
    });

// PUT /:userId - Update User by ID
UserRouter.put("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.update(req.params.userId, req.body));
    });

// User-List Routes ----------------------------------------------------------

// GET /:userId/lists - Find Lists for this User
UserRouter.get("/:userId/lists",
    async (req: Request, res: Response) => {
        res.send(await UserServices.lists(req.params.userId, req.query));
    });

// DELETE /:userId/lists/:listId - Disassociate User and List
UserRouter.delete("/:userId/lists/:listId}",
    async (req: Request, res: Response) => {
        res.send(await UserServices.listsExclude(req.params.userId, req.params.listId));
    });

// POST /:userId/lists/:listId - Associate User and List
UserRouter.post("/:userId/lists/:listId",
    async (req: Request, res: Response) => {
        let admin: boolean = false;
        if (req.query && (req.query.admin === "")) {
            admin = true;
        }
        res.send(await UserServices.listsInclude(req.params.userId, req.params.listId, admin))
    });

// Child Lookup Routes -------------------------------------------------------


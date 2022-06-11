// UserRouter ----------------------------------------------------------------

// Express endpoints for User models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {/* dumpRequestDetails, */ requireAdmin, requireSuperuser, requireUser} from "../oauth/OAuthMiddleware";
import UserServices from "../services/UserServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const UserRouter = Router({
    strict: true,
});

export default UserRouter;

// Model-Specific Routes (no userId) -----------------------------------------

// GET /exact/:username - Find User by exact username
UserRouter.get("/exact/:username",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.exact(
            req.params.username,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all matching Users
UserRouter.get("/",
//    dumpRequestDetails,
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.all(
            req.query
        ));
    });

// POST / - Insert a new User
UserRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await UserServices.insert(
            req.body
        ));
    });

// DELETE /:userId - Remove User by ID
UserRouter.delete("/:userId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.remove(req.params.userId));
    });

// GET /:userId - Find User by ID
UserRouter.get("/:userId",
    requireUser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.find(req.params.userId, req.query));
    });

// PUT /:userId - Update User by ID
UserRouter.put("/:userId",
    requireUser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.update(req.params.userId, req.body));
    });

// User-List Routes ----------------------------------------------------------

// GET /:userId/lists - Find Lists for this User
UserRouter.get("/:userId/lists",
    requireUser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.lists(req.params.userId, req.query));
    });

// POST /:userId/lists - Insert List and associate with this User
UserRouter.post("/:userId/lists",
    requireUser,
    async (req: Request, res: Response) => {
        const populate = ("" === req.query.populate);
        res.send(await UserServices.listsInsert(req.params.userId, req.body, populate));
    });

// DELETE /:userId/lists/:listId - Disassociate User and List
UserRouter.delete("/:userId/lists/:listId}",
    requireAdmin,
    requireUser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.listsExclude(req.params.userId, req.params.listId));
    });

// POST /:userId/lists/:listId - Associate User and List
UserRouter.post("/:userId/lists/:listId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        let admin: boolean = false;
        if (req.query && (req.query.admin === "")) {
            admin = true;
        }
        res.send(await UserServices.listsInclude(req.params.userId, req.params.listId, admin))
    });

// Account Management Routes -------------------------------------------------

// POST /accounts - Create a User and optionally associated List
UserRouter.post("/accounts",
    // No authentication required
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await UserServices.create(
            req.body
        ));
    });

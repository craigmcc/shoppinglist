// ItemRouter ----------------------------------------------------------------

// Express endpoints for Item models.

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/OAuthMiddleware";
import ItemServices from "../services/ItemServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const ItemRouter = Router({
    strict: true,
});

export default ItemRouter;

// Model-Specific Routes (no itemId) ---------------------------------------

// GET /:listId/exact/:name - Find Item by exact name
ItemRouter.get("/:listId/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await ItemServices.exact(
            req.params.listId,
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:listId - Find all Items
ItemRouter.get("/:listId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await ItemServices.all(
            req.params.listId,
            req.query
        ));
    });

// POST /:listId/ - Insert a new Item
ItemRouter.post("/:listId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await ItemServices.insert(
            req.params.listId,
            req.body
        ));
    });

// DELETE /:listId/:itemId - Remove Item by ID
ItemRouter.delete("/:listId/:itemId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await ItemServices.remove(
            req.params.listId,
            req.params.itemId,
        ));
    });

// GET /:listId/:itemId - Find Item by ID
ItemRouter.get("/:listId/:itemId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await ItemServices.find(
            req.params.listId,
            req.params.itemId,
            req.query
        ));
    });

// PUT /:listId/:itemId - Update Item by ID
ItemRouter.put("/:listId/:itemId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await ItemServices.update(
            req.params.listId,
            req.params.itemId,
            req.body
        ));
    });


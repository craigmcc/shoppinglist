// CategoryRouter ----------------------------------------------------------------

// Express endpoints for Category models.

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/OAuthMiddleware";
import CategoryServices from "../services/CategoryServices";
import {CREATED} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

export const CategoryRouter = Router({
    strict: true,
});

export default CategoryRouter;

// Model-Specific Routes (no categoryId) ---------------------------------------

// GET /:listId/exact/:name - Find Category by exact name
CategoryRouter.get("/:listId/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.exact(
            req.params.listId,
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:listId - Find all Categories
CategoryRouter.get("/:listId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.all(
            req.params.listId,
            req.query
        ));
    });

// POST /:listId/ - Insert a new Category
CategoryRouter.post("/:listId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.status(CREATED).send(await CategoryServices.insert(
            req.params.listId,
            req.body
        ));
    });

// DELETE /:listId/:categoryId - Remove Category by ID
CategoryRouter.delete("/:listId/:categoryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.remove(
            req.params.listId,
            req.params.categoryId,
        ));
    });

// GET /:listId/:categoryId - Find Category by ID
CategoryRouter.get("/:listId/:categoryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.find(
            req.params.listId,
            req.params.categoryId,
            req.query
        ));
    });

// PUT /:listId/:categoryId - Update Category by ID
CategoryRouter.put("/:listId/:categoryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.update(
            req.params.listId,
            req.params.categoryId,
            req.body
        ));
    });

// Model-Specific Routes (with listId) ---------------------------------------

CategoryRouter.get("/:listId/:categoryId/items",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await CategoryServices.items(
            req.params.listId,
            req.params.categoryId,
            req.query
        ));
    });

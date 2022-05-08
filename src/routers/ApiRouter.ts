// ApiRouter -----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import CategoryRouter from "./CategoryRouter";
import ItemRouter from "./ItemRouter";
import ListRouter from "./ListRouter";
import UserRouter from "./UserRouter";

// Public Objects ------------------------------------------------------------

export const ApiRouter = Router({
    strict: true,
});

export default ApiRouter;

// Model Specific Routers ---------------------------------------------------

ApiRouter.use("/categories", CategoryRouter);
ApiRouter.use("/items", ItemRouter);
ApiRouter.use("/lists", ListRouter);
ApiRouter.use("/users", UserRouter);

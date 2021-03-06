// ApiRouter -----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import CategoryRouter from "./CategoryRouter";
import ClientRouter from "./ClientRouter";
import EmailRouter from "./EmailRouter";
import ItemRouter from "./ItemRouter";
import ListRouter from "./ListRouter";
import PasswordRouter from "./PasswordRouter";
import ShareRouter from "./ShareRouter";
import UserRouter from "./UserRouter";

// Public Objects ------------------------------------------------------------

export const ApiRouter = Router({
    strict: true,
});

export default ApiRouter;

// Model Specific Routers ---------------------------------------------------

ApiRouter.use("/categories", CategoryRouter);
ApiRouter.use("/client", ClientRouter);
ApiRouter.use("/email", EmailRouter);
ApiRouter.use("/items", ItemRouter);
ApiRouter.use("/lists", ListRouter);
ApiRouter.use("/passwords", PasswordRouter);
ApiRouter.use("/shares", ShareRouter);
ApiRouter.use("/users", UserRouter);

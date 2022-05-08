// Database ------------------------------------------------------------------

// Set up database integration and return a configured Sequelize object.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
import {Sequelize} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import Category from "./Category";
import Item from "./Item";
import List from "./List";
import RefreshToken from "./RefreshToken";
import User from "./User";
import UserList from "./UserList";
import logger from "../util/ServerLogger";

// Configure Database Instance -----------------------------------------------

const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : "test";

export const Database = new Sequelize(DATABASE_URL, {
    logging: false,
    pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0
    }
});

Database.addModels([
    // User Stack
    User,
    AccessToken,
    RefreshToken,
    // List Stack
    List,
    UserList,
    Category,
    Item,
]);

logger.info({
    context: "Startup",
    msg: "Sequelize models initialized",
    dialect: `${Database.getDialect()}`,
    name: `${Database.getDatabaseName()}`,
});

export default Database;

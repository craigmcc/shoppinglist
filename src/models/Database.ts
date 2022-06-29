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
import Password from "./Password";
import RefreshToken from "./RefreshToken";
import Share from "./Share";
import User from "./User";
import UserList from "./UserList";
import logger from "../util/ServerLogger";

// Configure Database Instance -----------------------------------------------

const DATABASE_SSL = process.env.DATABASE_SSL ? process.env.DATABASE_SSL : "false";
const DATABASE_URL = process.env.DATABASE_URL ? process.env.DATABASE_URL : "test";

const options: any = {
    logging: false,
    pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0
    }
}
if (DATABASE_SSL === "true") {
    options.dialectOptions = {
        ssl: {
            rejectUnauthorized: false,
            require: true,
        }
    }
}

export const Database = new Sequelize(DATABASE_URL, options);

Database.addModels([
    // User Stack
    User,
    AccessToken,
    Password,
    RefreshToken,
    // List Stack
    List,
    UserList,
    Category,
    Item,
    Share,
]);

logger.info({
    context: "Startup",
    msg: "Sequelize models initialized",
    dialect: `${Database.getDialect()}`,
    name: `${Database.getDatabaseName()}`,
    ssl: DATABASE_SSL,
});

export default Database;

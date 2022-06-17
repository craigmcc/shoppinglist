// server --------------------------------------------------------------------

// Overall Express server for the Shopping List Application.

// External Modules ----------------------------------------------------------

import * as fs from "fs";

require("custom-env").env(true);
const https = require("https");

export const DATABASE_SYNC = process.env.DATABASE_SYNC ? process.env.DATABASE_SYNC : "none";
export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined;
export const PORT_HTTPS = process.env.PORT_HTTPS ? parseInt(process.env.PORT_HTTPS, 10) : undefined;

// Internal Modules ----------------------------------------------------------

import Database from "./models/Database";
import List from "./models/List";
import ExpressApplication from "./routers/ExpressApplication";
import logger from "./util/ServerLogger";

// Configure Models and Associations -----------------------------------------

Database.getDatabaseName(); // Trigger initialization of Database module
if (DATABASE_SYNC !== "none") {
    logger.info({
        context: "Startup",
        msg: "Synchronizing database table structures",
        sync: DATABASE_SYNC,
    });
    (async () => {
        const alter: boolean | undefined = DATABASE_SYNC === "alter" ? true : undefined;
        const force: boolean | undefined = DATABASE_SYNC === "force" ? true : undefined;
        try {
            const result = await Database.sync({
                alter: alter,               // Alter existing tables to match changes
                force: force,               // Drop and rebuild tables,
                logging: console.log,
            });

            // Did we come back from the sync call?
            logger.info({
                context: "Startup",
                msg: "Result of Database.sync()",
                result: result,
            });
            // Force a read to make sure the tables are there
            const lists = await List.findAll({ logging: console.log });
            logger.info({
                context: "Database.startup",
                msg: "Find all lists successful",
                lists: lists,
            });
        } catch (error) {
            logger.error({
                context: "Startup",
                msg: "Error synchronizing database",
                alter: alter,
                force: force,
                message: (error as Error).message,
            });
        }
    })();
}

// Configure and Start Server ------------------------------------------------

if (PORT) {
    ExpressApplication.listen(PORT, () => {
        logger.info({
            context: "Startup",
            msg: "Start HTTP Server",
            mode: NODE_ENV,
            port: PORT,
        });
    });
}

if (PORT_HTTPS && process.env.HTTPS_CERT && process.env.HTTPS_KEY) {
    https.createServer({
        cert: fs.readFileSync(process.env.HTTPS_CERT),
        key: fs.readFileSync(process.env.HTTPS_KEY),
    }, ExpressApplication).listen(PORT_HTTPS, () => {
        logger.info({
            context: "Startup",
            msg: "Start HTTPS Server",
            mode: NODE_ENV,
            port: PORT_HTTPS,
        });
    });
}

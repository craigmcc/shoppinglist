// ExpressApplication --------------------------------------------------------

// Overall Express application, configured as a Javascript class.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
const rfs = require("rotating-file-stream");
import {Timestamps} from "@craigmcc/shared-utils";

// Internal Modules ----------------------------------------------------------

import ApiRouter from "./ApiRouter";
import {handleOAuthError} from "../oauth/OAuthMiddleware";
import OAuthRouter from "../oauth/OAuthRouter";
import {handleHttpError, handleServerError, handleValidationError} from "../util/Middleware";
import logger from "../util/ServerLogger";

// Public Objects ------------------------------------------------------------

// Initialize Express environment
const app = express();
app.use(helmet());

// Configure access log management
const ACCESS_LOG = process.env.ACCESS_LOG ? process.env.ACCESS_LOG : "stderr";
morgan.token("date", (req, res): string => {
    return Timestamps.iso();
});
const REMOTE_USER_HEADER = "x-username";
morgan.token("remote-user", (req, res): string => {
    let username = "-";
    const header: string | string[] | undefined = req.headers[REMOTE_USER_HEADER];
    if (typeof header === "string") {
        username = header;
    }
    return username;
});

if ((ACCESS_LOG === "stderr") || (ACCESS_LOG === "stdout")) {
    app.use(morgan("combined", {
        skip: function (req, res) {
            return req.path === "/clientLog";
        },
        stream: (ACCESS_LOG === "stderr") ? process.stderr : process.stdout,
    }));
} else {
    app.use(morgan("combined", {
        skip: function (req, res) {
            return req.path === "/clientLog";
        },
        stream: rfs.createStream(ACCESS_LOG, {
            interval: "1d",
            path: "log",
        }),
    }))
}

// Configure body handling middleware
app.use(bodyParser.json({
}));
app.use(bodyParser.text({
    limit: "2mb",
    type: "text/csv",
}));
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Configure static file routing
const CLIENT_BASE: string = path.resolve("./") + "/client/build";
logger.info({
    context: "Startup",
    msg: "Static File Path",
    path: CLIENT_BASE
});
app.use(express.static(CLIENT_BASE));

// Configure application-specific routing
//app.use("/openapi.json", OpenApiRouter);
app.use("/api", ApiRouter);
app.use("/oauth", OAuthRouter);

// Configure error handling (must be last)
app.use(handleHttpError);
app.use(handleValidationError);
app.use(handleOAuthError);
app.use(handleServerError); // The last of the last :-)

// Configure unknown mappings back to client
app.get("*", (req, res) => {
    res.sendFile(CLIENT_BASE + "/index.html");
})

export default app;

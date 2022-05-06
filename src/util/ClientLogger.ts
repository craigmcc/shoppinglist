// ClientLogger --------------------------------------------------------------

// Configure and return a Pino logger for log objects forwarded from clients.

// External Modules ----------------------------------------------------------

import rfs = require("rotating-file-stream");

// Internal Modules ----------------------------------------------------------

import {Timestamps} from "@craigmcc/shared-utils";

// Public Objects ------------------------------------------------------------

const NODE_ENV = process.env.NODE_ENV;
const CLIENT_LOG = process.env.CLIENT_LOG ? process.env.CLIENT_LOG : "stderr";

const logger = (CLIENT_LOG === "stderr") || (CLIENT_LOG === "stdout")
    ? require("pino")({
        base: null, // Remove "hostname", "name", and "pid"
        level: (NODE_ENV === "production") ? "debug" : "trace",
        timestamp: function (): string {
            return ',"time":"' + Timestamps.iso() + '"';
        }
    }, (CLIENT_LOG === "stderr") ? process.stderr : process.stdout)
    : require("pino")({
        base: null, // Remove "hostname", "name", and "pid"
        level: (NODE_ENV === "production") ? "debug" : "trace",
        timestamp: function (): string {
            return ',"time":"' + Timestamps.iso() + '"';
        }
    }, rfs.createStream(CLIENT_LOG, {
        interval: "1d",
        path: "log",
    }));

export default logger;

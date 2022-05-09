// ClientLogger --------------------------------------------------------------

// Configure and return a logger for this browser-based application.

// The goal here is to allow developers to use the same "logger.<level>()"
// semantics on the client side that they get to use on the server side,
// with additional capabilities to dynamically change the client side level
// at which logging messages should be forwarded to the server.

// There is also special treatment when a logger is used (indirectly) in
// unit tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import ClientClient from "../clients/ClientClient";
import {Level} from "../types";

// Private Objects -----------------------------------------------------------

const TEST_ENV = "test" === process.env.NODE_ENV;

// Map log level names to log level values
const LOG_LEVEL_MAP = new Map<string, number>();
LOG_LEVEL_MAP.set(Level.DEBUG, 20);
LOG_LEVEL_MAP.set(Level.ERROR, 50);
LOG_LEVEL_MAP.set(Level.FATAL, 60);
LOG_LEVEL_MAP.set(Level.INFO, 30);
LOG_LEVEL_MAP.set(Level.TRACE, 10);
LOG_LEVEL_MAP.set(Level.WARN, 40);

// Public Objects ------------------------------------------------------------

class logger {

    constructor() {
        this.currentLevel = 30; // Default log level
    }

    // Public Methods --------------------------------------------------------

    public debug(object: any) { this.write(object, 20); }
    public error(object: any) { this.write(object, 50); }
    public fatal(object: any) { this.write(object, 60); }
    public info(object: any) { this.write(object, 30); }
    public trace(object: any) { this.write(object, 10); }
    public warn(object: any) { this.write(object, 40); }

    public setLevel(newName: string) {
        let newLevel: number | undefined = LOG_LEVEL_MAP.get(newName);
        if (newLevel) {
            this.currentLevel = newLevel;
        } else {
            this.currentLevel = 30;
        }
    }

    // Private Methods -------------------------------------------------------

    private async write(object: any, level: number) {
        if (level >= this.currentLevel) {
            const output = {
                level: level,
                ...object,
            }
            if (!TEST_ENV) {
                try {
                    await ClientClient.log(output);
                } catch (error) {
                    console.error(`Error '${(error as Error).message}' logging client message`, object);
                }
            } else {
                console.log(output);
            }
        }

    }

    // Private Properties ----------------------------------------------------

    private currentLevel: number;

}

export default new logger();

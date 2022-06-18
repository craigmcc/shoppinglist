// EmailServices -------------------------------------------------------------

// Email receiving services.

// External Modules ----------------------------------------------------------

import {IncomingMail} from "cloudmailin";

// Internal Modules ----------------------------------------------------------

import logger from "../util/ServerLogger";

// Public Objects ------------------------------------------------------------

class EmailServices {

    public async receive(message: IncomingMail): Promise<void> {
        console.log("INCOMING MESSAGE", message);
    }

}

export default new EmailServices();


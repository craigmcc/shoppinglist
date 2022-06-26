// EmailServices -------------------------------------------------------------

// Email receiving services.

// External Modules ----------------------------------------------------------

import {IncomingMail} from "cloudmailin";
import Mail from "nodemailer/lib/mailer";

// Internal Modules ----------------------------------------------------------

import {sendMessage} from "./GMailServices";
import logger from "../util/ServerLogger";

// Public Objects ------------------------------------------------------------

class EmailServices {

    public async receive(message: IncomingMail): Promise<void> {
        logger.debug({
            context: "EmailServices.receive",
            message: message,
        });
        // TODO - dispatch to a handler somehow
    }

    public async send(message: Mail.Options): Promise<void> {
        logger.debug({
            context: "EmailServices.send",
            message: message,
        })
        await sendMessage(message);
    }

}

export default new EmailServices();

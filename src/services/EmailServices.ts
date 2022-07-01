// EmailServices -------------------------------------------------------------

// Email receiving services.

// External Modules ----------------------------------------------------------

import {IncomingMail} from "cloudmailin";
import Mail from "nodemailer/lib/mailer";

// Internal Modules ----------------------------------------------------------

import {sendMessage} from "./GMailServices";
import {ServerError} from "../util/HttpErrors";
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
        });
        try {
            await sendMessage(message);
        } catch (error) {
            logger.error({
                context: "EmailServices.send",
                error: error,
            });
            throw new ServerError(error as Error, "EmailServices.send");
        }
    }

}

export default new EmailServices();

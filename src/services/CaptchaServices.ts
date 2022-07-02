// CaptchaServices -----------------------------------------------------------

// Callback services for verifying a Google Captcha V2 token.

// External Modules ----------------------------------------------------------

const axios = require("axios");
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "test";
const SECRET = process.env.RECAPTCHA_SECRET_KEY
    ? process.env.RECAPTCHA_SECRET_KEY : "Unknown";
const URL_PATTERN = "https://www.google.com/recaptcha/api/siteverify?secret=:secret&response=:token";

// Internal Modules ----------------------------------------------------------

import logger from "../util/ServerLogger";

// Public Objects ------------------------------------------------------------

export const TEST_MODE_TOKEN = "TEST MODE TOKEN";

export type VerifyTokenV2Response = {
    challenge_ts: string;               // ISO format timestamp of the challenge
    "error-codes"?: string[];           // Error code(s) if challenge failed
    hostname: string;                   // Hostname of the challenge
    success: boolean;                   // Was confirmation successful?
}

export const verifyTokenV2 = async (token: string): Promise<VerifyTokenV2Response> => {

    if ((NODE_ENV === "test") && (token === TEST_MODE_TOKEN)) {
        return {
            challenge_ts: (new Date()).toISOString(),
            hostname: "localhost",
            success: true,
        }
    }

    const url = URL_PATTERN
        .replace(":secret", SECRET)
        .replace(":token", token);
    try {
        const response = (await axios.post(url)).data as VerifyTokenV2Response;
        logger.debug({
            context: "CaptchaServices.verifyToken",
            token: token,
            response: response,
        });
        return response;
    } catch (error) {
        logger.error({
            context: "CaptchaServices.verifyToken",
            token: token,
            error: error,
        });
        throw error;
    }

}

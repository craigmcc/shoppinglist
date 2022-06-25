// GMailServices -------------------------------------------------------------

// Support for interacting with GMail API services.

// The following environment variables are expected:
// - GMAIL_EMAIL                        Email address of the GMail user
// - GOOGLE_CLIENT_ID                   Client ID for this application
// - GOOGLE_CLIENT_SECRET               Client Secret for this application
// - GOOGLE_REFRESH_TOKEN               Current refresh token for this application

// External Modules ----------------------------------------------------------

import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

// Internal Modules ----------------------------------------------------------

import {GoogleClient} from "./GoogleServices";

// Environment Variables -----------------------------------------------------

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET : "";
const FROM_EMAIL = process.env.GMAIL_EMAIL ? process.env.GMAIL_EMAIL : "";
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN ? process.env.GOOGLE_REFRESH_TOKEN : "";

// Public Objects ------------------------------------------------------------

/**
 * Create and return a NodeMailer transporter, configured for use with GMail.
 *
 * @param accessToken                   Currently valid access token
 */
export const GMailTransporter = (accessToken: string) => {
    return nodemailer.createTransport({
        auth: {
            accessToken: accessToken,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            type: "OAUTH2",
            user: FROM_EMAIL,
        },
        service: "gmail",
    });
}

/**
 * Send the specified mail message.
 *
 * @param message                       Message options for this message
 *
 * @throws Error if message sending fails
 */
export const sendMessage = async (message: Mail.Options) => {
    const accessToken = (await GoogleClient.getAccessToken()).token;
    if (!accessToken) {
        throw new Error("No access token is available");
    }
    const transporter = GMailTransporter(accessToken);
    return await transporter.sendMail(message);
}

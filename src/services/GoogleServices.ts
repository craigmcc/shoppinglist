// GoogleServices ------------------------------------------------------------

// Support for interacting with various Google API and NodeMailer services.

// The following environment variables are expected:
// - GMAIL_EMAIL                        Email address of the GMail user
// - GOOGLE_CLIENT_ID                   Client ID for this application
// - GOOGLE_CLIENT_SECRET               Client Secret for this application
// - GOOGLE_REDIRECT_URI                OAuth2 Redirect URI for this application
// - GOOGLE_REFRESH_TOKEN               Current refresh token for this application

// External Modules ----------------------------------------------------------

import {google} from "googleapis";

// Environment Variables -----------------------------------------------------

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID : "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET : "";
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ? process.env.GOOGLE_REDIRECT_URI : "";
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN ? process.env.GOOGLE_REFRESH_TOKEN : "";

// Public Objects ------------------------------------------------------------

/**
 * Return a static instance of a Google OAuth2 client, configured
 * based on the required environment variables.
 */
export const GoogleClient
    = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
GoogleClient.setCredentials({ refresh_token: REFRESH_TOKEN });


// LoginDataUtils ------------------------------------------------------------

// Common utility functions for handling OAuth interactions, plus managing
// local storage for Login Data.

// External Modules ----------------------------------------------------------

import {OAuthError} from "@craigmcc/oauth-orchestrator/dist/errors";
import {PasswordTokenRequest, RefreshTokenRequest, TokenResponse} from "@craigmcc/oauth-orchestrator/dist/types";

// Internal Modules ----------------------------------------------------------

import logger from "./ClientLogger";
import LocalStorage from "./LocalStorage";
import {LOGIN_DATA_KEY} from "../constants";
import {LoginData} from "../types";
import Credentials from "../models/Credentials";
import OAuth from "../clients/OAuth";

// Private Objects ----------------------------------------------------------

const loginData = new LocalStorage<LoginData>(LOGIN_DATA_KEY);

// Public Objects -----------------------------------------------------------

/**
 * Handle login for the specified credentials.
 *
 * @param credentials                   Username and password to be submitted
 *
 * @returns                             Updated LoginData after login
 *
 * @throws OAuthError                   If login was not successful
 */
export const login = async (credentials: Credentials): Promise<LoginData> => {

    // Use the specified Credentials to acquire tokens
    const tokenRequest: PasswordTokenRequest = {
        grant_type: "password",
        password: credentials.password,
        username: credentials.username,
    }
    // Will throw OAuthError on login failure
    const tokenResponse: TokenResponse =
        (await OAuth.post("/token", tokenRequest)).data;
    logger.debug({
        context: "LoginDataUtils.login",
        msg: "Successful login",
        username: credentials.username,
    });

    // Construct, save, and return LoginData representing the new state
    const newData: LoginData = {
        accessToken: tokenResponse.access_token,
        expires: new Date((new Date()).getTime() + (tokenResponse.expires_in * 1000)),
        loggedIn: true,
        refreshToken: tokenResponse.refresh_token ? tokenResponse.refresh_token : null,
        scope: tokenResponse.scope,
        username: credentials.username,
    }
    loginData.value = newData;
    return newData;

}

/**
 * Handle logout for the currently logged in User.
 *
 * @returns                             Updated LoginData after logout
 */
export const logout = async (): Promise<LoginData> => {

    let currentData = loginData.value;

    // Revoke the currently assigned access token (if any)
    if (currentData.loggedIn && currentData.accessToken) {
        try {
            logger.debug({
                context: "LoginDataUtils.logout",
                msg: "Attempting logout",
                username: currentData.username,
            });
            await OAuth.delete("/token", {
                headers: {
                    "Authorization": `Bearer ${currentData.accessToken}`
                }
            });
        } catch (error) {
            logger.error({
                context: "loginDataUtils.logout",
                msg: "Logout failed",
                username: currentData.username,
                error: (error as OAuthError).message,
            });
            // Ignore any error
        }
    }

    // Update, store, and return login data after the logout
    currentData = {
        accessToken: null,
        expires: null,
        loggedIn: false,
        refreshToken: null,
        scope: null,
        username: null,
    }
    loginData.value = currentData;
    return currentData;

}

/**
 * If the current access token is expired, and if there is a refresh token,
 * use the refresh token to request a new access token.  Return an updated
 * LoginData object if this was accomplished, or the current one if not.
 *
 * @returns                             Possibly updated LoginData after refresh
 *
 * @throws OAuthError                   If an authentication error occurs
 */
export const refresh = async (): Promise<LoginData> => {

    let currentData = loginData.value;
    const now = new Date();

    // If the current access token looks unexpired, or there is no
    // refresh token, return the current data unchanged
    if (!currentData.accessToken) {
        return currentData;
    }
    if (currentData.expires) {
        // Coming back from local storage expires is a string
        const expiresDate = (typeof currentData.expires === "string")
            ? new Date(currentData.expires)
            : currentData.expires;
        if (expiresDate > now) {
            return currentData;
        }
    }
    if (!currentData.refreshToken) {
        return currentData;
    }

    try {

        // Attempt to use the refresh token to acquire a new access token,
        // update the current local data.
        const tokenRequest: RefreshTokenRequest = {
            grant_type: "refresh_token",
            refresh_token: currentData.refreshToken,
        }
        const tokenResponse: TokenResponse =
            (await OAuth.post("/token", tokenRequest)).data;
        currentData.accessToken = tokenResponse.access_token;
        currentData.expires = new Date((new Date()).getTime() + (tokenResponse.expires_in * 1000));
        currentData.loggedIn = true;
        if (tokenResponse.refresh_token) {
            currentData.refreshToken = tokenResponse.refresh_token ? tokenResponse.refresh_token : null;
        } else {
            // Keep the previous refresh token
        }
        currentData.scope = tokenResponse.scope;
        // NOTE - Leave loggedIn and username alone

        // Store and return the updated login data
        logger.debug({
            context: "LoginDataUtils.refresh",
            msg: "Updating login data for refreshed access token",
            data: currentData,
        });
        loginData.value = currentData;
        return currentData;

    } catch (error) {

        // Report an error and return the current login data unchanged
        logger.info({
            context: "LoginDataUtils.refresh",
            msg: "Attempted refresh returned an error",
            message: (error as Error).message,
        });
        return currentData;

    }

}

// LoginContext --------------------------------------------------------------

// React Context containing information about the currently logged in user,
// if there is one, and associated state representing currently selected
// Lists, Items, and Categories.

// External Modules ----------------------------------------------------------

import React, {createContext, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {LOGIN_CONTEXT_DATA_KEY, LOGIN_CONTEXT_USER_KEY} from "../../constants";
import {Scope} from "../../types";
import OAuth from "../../clients/OAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import TokenResponse from "../../models/TokenResponse";
import User from "../../models/User";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";

// Context Properties --------------------------------------------------------

// Data that is visible to HTTP clients not part of the React component hierarchy
export interface LoginData {
    accessToken: string | null;         // Current access token (if logged in)
    expires: Date | null;               // Absolute expiration time (if logged in)
    loggedIn: boolean;                  // Is user currently logged in?
    refreshToken: string | null;        // Current refresh token (if logged in and returned)
    scope: string | null;               // Allowed scope(s) (if logged in)
    username: string | null;            // Logged in username (if logged in)
}

// Dummy initial values for Data
const LOGIN_DATA: LoginData = {
    accessToken: null,
    expires: null,
    loggedIn: false,
    refreshToken: null,
    scope: null,
    username: null,
};

// Dummy initial values for User
const LOGIN_USER: User = new User({
    active: false,
    firstName: "-----",
    lastName: "-----"
});

// Context state (including data) visible to LoginContext children

export interface LoginState {
    data: LoginData;                    // Externally visible information
    user: User;                         // Currently logged in User (if any)
    handleLogin: (username: string, tokenResponse: TokenResponse) => void;
    handleLogout: () => void;
    refreshUser: (data?: LoginData) => Promise<void>; // Refresh user data
    validateScope: (scope: string) => boolean;
}

const LoginContext = createContext<LoginState>({
    data: LOGIN_DATA,
    user: LOGIN_USER,
    handleLogin: (username, tokenResponse) => {},
    handleLogout: () => {},
    refreshUser: (data) => {},
    validateScope: (scope: string): boolean => { return false; }
} as LoginState);

// Logging level constants

const LOG_DEFAULT = "info";             // Default log level
const LOG_PREFIX = "log:";              // Prefix for scope values defining log level

// Provider for LoginContext -------------------------------------------------

// @ts-ignore
export const LoginContextProvider = ({ children }) => {

    const [alloweds, setAlloweds] = useState<string[]>([]);
    const [data, setData] = useLocalStorage<LoginData>(LOGIN_CONTEXT_DATA_KEY, LOGIN_DATA);
    const [user, setUser] = useLocalStorage<User>(LOGIN_CONTEXT_USER_KEY, LOGIN_USER);

    /**
     * Handle a successful login.
     *
     * @param username                  // Username that has been logged in
     * @param tokenResponse             // OAuth response with token(s) and scope
     */
    const handleLogin = async (username: string, tokenResponse: TokenResponse): Promise<void> => {

        // Save allowed scope(s) and set logging level
        let logLevel = LOG_DEFAULT;
        if (tokenResponse.scope) {
            const theAlloweds = tokenResponse.scope.split(" ");
            setAlloweds(theAlloweds);
            theAlloweds.forEach(allowed => {
                if (allowed.startsWith(LOG_PREFIX)) {
                    logLevel = allowed.substring(LOG_PREFIX.length);
                }
            })
        } else {
            setAlloweds([]);
        }
        logger.setLevel(logLevel);

        // Document this login
        logger.info({
            context: "LoginContext.handleLogin",
            username: username,
            scope: tokenResponse.scope,
            logLevel: logLevel,
        });

        // Update the stored data to show this username is now logged in
        const theData: LoginData = {
            accessToken: tokenResponse.access_token,
            expires: new Date((new Date()).getTime() + (tokenResponse.expires_in * 1000)),
            loggedIn: true,
            refreshToken: tokenResponse.refresh_token ? tokenResponse.refresh_token : null,
            scope: tokenResponse.scope,
            username: username,
        }
        setData(theData);

        // Refresh the current User information
        await refreshUser(theData);

    }

    /**
     * Handle a successful logout.
     */
    const handleLogout = async (): Promise<void> => {

        logger.info({
            context: "LoginContext.handleLogout",
            username: data.username,
        });

        // Reset logging to the default level
        logger.setLevel(LOG_DEFAULT);

        // Update the stored data to show this user is now logged out
        const theData = {
            accessToken: null,
            expires: null,
            loggedIn: false,
            refreshToken: null,
            scope: null,
            username: null,
        };
        setData(theData);
        setUser(LOGIN_USER);

    }

    /**
     * Refresh the User object (will be null if a user is not logged on).
     *
     * @param theData                   Optional LoginData (needed during handleLogin
     *                                  but can be omitted if calling this independently)
     */
    const refreshUser = async (theData?: LoginData): Promise<void> => {
        const useData: LoginData = theData ? theData : data;
        logger.debug({
            context: "LoginContext.refreshUser",
            data: useData,
        });
        if (useData.loggedIn) {
            const user: User = ToModel.USER((await OAuth.get("/me")).data);
            logger.debug({
                context: "LoginContext.refreshUser",
                user: user,
            });
            setUser(user);
        } else {
            setUser(LOGIN_USER);
        }
    }

    /**
     * Return true if the currently logged in user has authorization for the
     * specified scope.
     *
     * @param scope                     Scope to be tested for
     */
    const validateScope = (scope: string): boolean => {

        // Users not logged in will never pass scope requirements
        if (!data.loggedIn) {
            return false;
        }

        // Special handling for superuser scope
        if (alloweds.includes(Scope.SUPERUSER)) {
            return true;
        }

        // Special handling for a logged in user with *any* scope
        if (scope === "") {
            return true;
        }

        // Otherwise, check required scope(s) versus allowed scope(s)
        const requireds = scope ? scope.split(" ") : [];
        if (requireds.length === 0) {
            return true;
        }
        let missing = false;
        requireds.forEach(required => {
            if (!alloweds.includes(required)) {
                missing = true;
            }
        });
        if (missing) {
            return false;
        }

        // The requested scope is allowed
        return true;

    }

    // Prepare and return the initial context values
    const loginContext: LoginState = {
        data: data,
        user: user,
        handleLogin: handleLogin,
        handleLogout: handleLogout,
        refreshUser: refreshUser,
        validateScope: validateScope,
    };

    return (
        <LoginContext.Provider value={loginContext}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContext;

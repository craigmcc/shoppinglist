// LoginContext --------------------------------------------------------------

// React Context containing information about the currently logged in user,
// if there is one, and associated state representing currently selected
// Lists, Items, and Categories.

// External Modules ----------------------------------------------------------

import React, {createContext, useState} from "react";

// Internal Modules ----------------------------------------------------------

import useLocalStorage from "../../hooks/useLocalStorage";
import TokenResponse from "../../models/TokenResponse";
import logger from "../../util/ClientLogger";
import LocalStorage from "../../util/LocalStorage";

// Context Properties --------------------------------------------------------

const LOG_DEFAULT = "info";             // Default log level
const LOG_PREFIX = "log:";              // Prefix for scope values defining log level

// Data that is visible to HTTP clients not part of the React component hierarchy
export interface Data {
    accessToken: string | null;         // Current access token (if logged in)
    expires: Date | null;               // Absolute expiration time (if logged in)
    loggedIn: boolean;                  // Is user currently logged in?
    refreshToken: string | null;        // Current refresh token (if logged in and returned)
    scope: string | null;               // Allowed scope(s) (if logged in)
    username: string | null;            // Logged in username (if logged in)
}

// For use by HTTP clients to include in their requests

export let LOGIN_DATA: Data = {
    accessToken: null,
    expires: null,
    loggedIn: false,
    refreshToken: null,
    scope: null,
    username: null,
};

// Context state (including data) visible to LoginContext children

export interface State {
    data: Data;                         // Externally visible information
    handleLogin: (username: string, tokenResponse: TokenResponse) => void;
    handleLogout: () => void;
    // TODO - scope validation stuff
}

const LoginContext = createContext<State>({
    data: LOGIN_DATA,
    handleLogin: (username, tokenResponse) => {},
    handleLogout: () => {},
});

// Provider for LoginContext -------------------------------------------------

const LOGIN_CONTEXT_DATA_KEY = "LOGIN_CONTEXT_DATA"; // Local storage key
export const LOGIN_CONTEXT_EXTRA_KEY = "LOGIN_CONTEXT_EXTRA";

// @ts-ignore
export const LoginContextProvider = ({ children }) => {

    const extraData = new LocalStorage(LOGIN_CONTEXT_EXTRA_KEY, LOGIN_DATA);
    const [alloweds, setAlloweds] = useState<string[]>([]);
    const [data, setData] = useLocalStorage<Data>(LOGIN_CONTEXT_DATA_KEY, LOGIN_DATA);

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
        const theData: Data = {
            accessToken: tokenResponse.access_token,
            expires: new Date((new Date()).getTime() + (tokenResponse.expires_in * 1000)),
            loggedIn: true,
            refreshToken: tokenResponse.refresh_token ? tokenResponse.refresh_token : null,
            scope: tokenResponse.scope,
            username: username,
        }
        setData(theData);
        LOGIN_DATA = { ...theData }; // No corruption allowed
        extraData.value = LOGIN_DATA;

    }

    /**
     * Handle a successful logout.
     */
    const handleLogout = async (): Promise<void> => {

        logger.info({
            context: "LoginContext.handleLogout",
            username: data.username,
        });

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
        LOGIN_DATA = { ...theData }; // No corruption allowed
        extraData.value = LOGIN_DATA;

        logger.setLevel(LOG_DEFAULT);

    }

    // Prepare and return the initial context values
    const loginContext: State = {
        data: data,
        handleLogin: handleLogin,
        handleLogout: handleLogout,
    };

    return (
        <LoginContext.Provider value={loginContext}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContext;

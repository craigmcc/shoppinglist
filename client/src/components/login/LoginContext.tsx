// LoginContext --------------------------------------------------------------

// React Context containing information about the currently logged in user,
// if there is one, and associated state representing currently selected
// Lists, Items, and Categories.

// External Modules ----------------------------------------------------------

import React, {createContext, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {LOGIN_DATA_KEY, LOGIN_USER_KEY} from "../../constants";
import {LoginData, Scope} from "../../types";
import OAuth from "../../clients/OAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import Credentials from "../../models/Credentials";
import List from "../../models/List";
import User from "../../models/User";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {login, logout} from "../../util/LoginDataUtils";
import * as ToModel from "../../util/ToModel";

// Context Properties --------------------------------------------------------

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
    handleLogin: (credentials: Credentials) => void;
    handleLogout: () => void;
    refreshUser: (data?: LoginData) => Promise<void>; // Refresh user data
    validateAdmin: (list: List) => boolean;
    validateRegular: (list: List) => boolean;
    validateScope: (scope: string) => boolean;
}

const LoginContext = createContext<LoginState>({
    data: LOGIN_DATA,
    user: LOGIN_USER,
    handleLogin: (credentials) => {},
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
    const [data, setData] = useLocalStorage<LoginData>(LOGIN_DATA_KEY, LOGIN_DATA);
    const [user, setUser] = useLocalStorage<User>(LOGIN_USER_KEY, LOGIN_USER);

    /**
     * Attempt a login and record the results.
     *
     * @param credentials               Login credentials to authenticate
     *
     * @throws OAuthError               If authentication fails
     */
    const handleLogin = async (credentials: Credentials): Promise<void> => {

        // Attempt to authenticate the specified credentials
        const newData = await login(credentials);
        setData(newData);

        // Save allowed scope(s) and set logging level
        let logLevel = LOG_DEFAULT;
        if (newData.scope) {
            const theAlloweds = newData.scope.split(" ");
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
            username: newData.username,
            scope: newData.scope,
            logLevel: logLevel,
        });

        // Refresh the current User information
        await refreshUser(newData);

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

        // Perform logout on the server
        setData(await logout());

        // Erase our currently logged in User information
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
            logger.info({
                context: "LoginContext.refreshUser",
                user: Abridgers.USER(user),
            });
            setUser(user);
        } else {
            logger.info({
                context: "LoginContext.refreshUser",
                msg: "Not logged in",
            });
            setUser(LOGIN_USER);
        }
    }

    /**
     * Return true if the currently logged in user has regular permissions
     * on the specified List.
     *
     * @param list                      List to be tested for
     */
    const validateAdmin = (list: List): boolean => {
        return validateScope(`admin:${list.id}`);
    }

    /**
     * Return true if the currently logged in user has admin permissions
     * on the specified List.
     *
     * @param list                      List to be tested for
     */
    const validateRegular = (list: List): boolean => {
        if (validateScope(`list:${list.id}`)) {
            return true;
        } else
            return validateScope(`admin:${list.id}`);
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
        validateAdmin: validateAdmin,
        validateRegular: validateRegular,
        validateScope: validateScope,
    };

    return (
        <LoginContext.Provider value={loginContext}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContext;

// Wrapper ------------------------------------------------------------------

// Provide an appropriate wrapper component around  a context that will
// surround its specified children in a unit test.

// External Modules ---------------------------------------------------------

// Internal Modules ---------------------------------------------------------

import LoginContext, {LoginState} from "../components/login/LoginContext";
import User from "../models/User";

// Public Objects -----------------------------------------------------------

/**
 * Return a wrapper that surrounds the specified children with a LoginContext
 * instance.
 *
 * @param children                      Child components to be wrapped
 * @param user                          User to be logged in [not logged in]
 */
// @ts-ignore
export const loginContext = ({children}, user?: User): JSX.Element => {
    return (
        <LoginContext.Provider value={loginState(user)}>
            {children}
        </LoginContext.Provider>
    )
}

// Private Objects -----------------------------------------------------------

/**
 * Return a preconfigured LoginState value, based on whether
 * the specified User (if any) is to be considered logged in or not.
 *
 * @param user                          User to be logged in [not logged in]
 */
const loginState = (user?: User): LoginState => {
    return {
        data: {
            accessToken: (user) ? "accesstoken" : null,
            expires: (user) ? new Date() : null,
            loggedIn: (user) ? true : false,
            refreshToken: (user) ? "refreshtoken" : null,
            scope: (user) ? user.scope : null,
            username: (user) ? user.username : null,
        },
        user: user ? user : new User(),
        handleLogin: jest.fn(),
        handleLogout: jest.fn(),
        refreshUser: jest.fn(),
        validateAdmin: jest.fn(),
        validateRegular: jest.fn(),
        validateScope: jest.fn(),
    }
}

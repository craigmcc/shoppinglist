// OAuthOrchestratorHandlers -------------------------------------------------

// Handlers for use by @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {
    Identifier,
    AuthenticateUser,
    CreateAccessToken,
    CreateRefreshToken,
    InvalidRequestError,
    OrchestratorHandlers,
    RetrieveAccessToken,
    RetrieveRefreshToken,
    RevokeAccessToken,
} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import {generateRandomToken, verifyPassword} from "./OAuthUtils";
import OAuthAccessToken from "../models/AccessToken";
import OAuthRefreshToken from "../models/RefreshToken";
import OAuthUser from "../models/User";

// Private Objects -----------------------------------------------------------

const authenticateUser: AuthenticateUser
    = async (username: string, password: string) =>
{
    const user = await OAuthUser.findOne({
        where: { username: username }
    });
    if (user) {
        if (!user.active) {
            // Creative subterfuge to not give anything away
            throw new InvalidRequestError(
                "username: Invalid or missing username or password",
                "OAuthOrchestratorHandlers.authenticateUser"
            );
        }
        if (!(await verifyPassword(password, user.password))) {
            // Creative subterfuge to not give anything away
            throw new InvalidRequestError(
                "username: Missing or invalid username or password",
                "OAuthOrchestratorHandlers.authenticateUser"
            );
        }
        return {
            scope: user.scope,
            userId: user.id
        }
    } else {
        throw new InvalidRequestError(
            "username: Missing or invalid username or password",
            "OAuthOrchestratorHandlers.authenticateUser"
        );
    }
}

const createAccessToken: CreateAccessToken
    = async (expires: Date, scope :string, userId: Identifier) =>
{
    const incoming: Partial<OAuthAccessToken> = {
        expires: expires,
        scope: scope,
        token: await generateRandomToken(),
        userId: String(userId),
    }
    const outgoing =
        await OAuthAccessToken.create(incoming as OAuthAccessToken, {
            fields: [ "expires", "scope", "token", "userId" ]
        });
    return {
        expires: outgoing.expires,
        scope: outgoing.scope,
        token: outgoing.token,
        userId: outgoing.id,
    };
}

const createRefreshToken: CreateRefreshToken
    = async (accessToken: string, expires: Date, userId: Identifier) =>
{
    const incoming: Partial<OAuthRefreshToken> = {
        accessToken: accessToken,
        expires: expires,
        token: await generateRandomToken(),
        userId: String(userId),
    }
    const outgoing =
        await OAuthRefreshToken.create(incoming as OAuthRefreshToken, {
            fields: [ "accessToken", "expires", "token", "userId" ]
        });
    return {
        accessToken: outgoing.accessToken,
        expires: outgoing.expires,
        token: outgoing.token,
        userId: outgoing.id,
    };
}

const retrieveAccessToken: RetrieveAccessToken = async (token: string) => {
    const accessToken = await OAuthAccessToken.findOne({
        where: { token: token }
    });
    if (accessToken) {
        return {
            expires: accessToken.expires,
            scope: accessToken.scope,
            token: accessToken.token,
            userId: accessToken.userId,
        };
    } else {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.retrieveAccessToken"
        );
    }
}

const retrieveRefreshToken: RetrieveRefreshToken = async (token: string) => {
    const refreshToken = await OAuthRefreshToken.findOne({
        where: { token: token }
    });
    if (refreshToken) {
        return {
            accessToken: refreshToken.accessToken,
            expires: refreshToken.expires,
            token: refreshToken.token,
            userId: refreshToken.userId,
        };
    } else {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.retrieveRefreshToken"
        );
    }
}

const revokeAccessToken: RevokeAccessToken = async (token: string): Promise<void> => {
    const accessToken = await OAuthAccessToken.findOne({
        where: { token: token }
    });
    if (!accessToken) {
        throw new InvalidRequestError(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.revokeAccessToken"
        );
    }
    // Revoke this RefreshToken
    await OAuthRefreshToken.destroy({
        where: { accessToken: token }
    });
    // Revoke any associated AccessTokens as well
    await OAuthAccessToken.destroy({
        where: { token: token }
    });

}

// Public Objects ------------------------------------------------------------

export const OAuthOrchestratorHandlers: OrchestratorHandlers = {
    authenticateUser: authenticateUser,
    createAccessToken: createAccessToken,
    createRefreshToken: createRefreshToken,
    retrieveAccessToken: retrieveAccessToken,
    retrieveRefreshToken: retrieveRefreshToken,
    revokeAccessToken: revokeAccessToken,
}

export default OAuthOrchestratorHandlers;


// User ----------------------------------------------------------------------

// A user who may be authenticated to, and use the features of, this application.

// Internal Modules ----------------------------------------------------------

import AccessToken from "./AccessToken";
import RefreshToken from "./RefreshToken";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const USERS_BASE = "/users";

export class UserData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.email = data.email ? data.email : null;
        this.firstName = data.firstName ? data.firstName : null;
        this.lastName = data.lastName ? data.lastName : null;
        this.password = data.password ? data.password : null;
        this.scope = data.scope ? data.scope : null;
        this.username = data.username ? data.username : null;
        this.admin = false;
        if (data.admin !== undefined) {
            this.admin = data.admin;
        } else if (data.UserList && (data.UserList.admin !== undefined)) {
            this.admin = data.UserList.admin;
        }
    }

    id: string;
    active: boolean;
    admin: boolean;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    scope: string;
    username: string;

}

class User extends UserData {

    constructor(data: any = {}) {
        super(data);
        this.accessTokens = data.accessTokens ? ToModel.ACCESS_TOKENS(data.accessTokens) : undefined;
        this.refreshTokens = data.refreshTokens ? ToModel.REFRESH_TOKENS(data.refreshTokens) : undefined;
    }

    accessTokens?: AccessToken[];
    refreshTokens?: RefreshToken[];

}

export default User;

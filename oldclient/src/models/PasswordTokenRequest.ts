// PasswordTokenRequest ------------------------------------------------------

// Request for an OAuth access token (and optional refresh token).

// Public Objects ------------------------------------------------------------

class PasswordTokenRequest {

    constructor(data: any = {}) {
        this.grant_type = "password";
        this.password = data.password;
        this.scope = data.scope || null;
        this.username = data.username;
    }

    grant_type!: string;
    password!: string;
    scope?: string;
    username!: string;

}

export default PasswordTokenRequest;

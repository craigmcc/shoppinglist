// TokenResponse -------------------------------------------------------------

// Response from an OAuth Authentication Server on an access token request.

// Public Objects ------------------------------------------------------------

class TokenResponse {

    constructor(data: any = {}) {
        this.access_token = data.access_token;
        this.expires_in = data.expires;
        this.refresh_token = data.refresh_token || null;
        this.scope = data.scope || null;
        this.token_type = data.token_type;
    }

    access_token!: string;
    expires_in!: number;
    refresh_token?: string;
    scope!: string;
    token_type!: string;

}

export default TokenResponse;

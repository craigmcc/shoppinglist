// AccessToken ---------------------------------------------------------------

// An access token that has been granted to a particular User.

// Public Objects ------------------------------------------------------------

class AccessToken {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : "";
        this.expires = data.expires ? data.expires : null;
        this.scope = data.scope ? data.scope : null;
        this.token = data.token ? data.token : null;
        this.userId = data.userId ? data.userId : null;
    }

    id: string;
    expires!: string;
    scope!: string;
    token!: string;
    userId!: string;

}

export default AccessToken;

// RefreshToken ---------------------------------------------------------------

// A refresh token that has been granted to a particular User.

// Public Objects ------------------------------------------------------------

class RefreshToken {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : null;
        this.accessToken = data.accessToken ? data.accessToken : null;
        this.expires = data.expires ? data.expires : null;
        this.token = data.token ? data.token : null;
        this.userId = data.userId ? data.userId : null;
    }

    id: string;
    accessToken!: string;
    expires!: string;
    token!: string;
    userId!: string;

}

export default RefreshToken;

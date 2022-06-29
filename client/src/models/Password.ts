// Password ------------------------------------------------------------------

// An outstanding offer to change a logged in User's password, or reset it
// for the "forgot my password" scenario.

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const PASSWORDS_BASE = "/passwords";

export class Password {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : null;
        this.email = data.email ? data.email : null;
        this.expires = data.expires ? data.expires : null;
        this.password1 = data.password1 ? data.password1 : null;
        this.password2 = data.password2 ? data.password2 : null;
        this.token = data.token ? data.token : null;
    }

    id: string;
    email: string;
    expires: string;
    password1: string;
    password2: string;
    token: string;                      // Google reCAPTCHA v2 token

}

export default Password;

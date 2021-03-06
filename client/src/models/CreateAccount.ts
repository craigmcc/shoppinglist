// CreateAccount -------------------------------------------------------------

// Details required to set up a new User account and optional first List.

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

class CreateAccount {

    constructor(data: any = {}) {
        this.email = data.email ? data.email : "";
        this.firstName = data.firstName ? data.firstName : "";
        this.lastName = data.lastName ? data.lastName : "";
        this.listName = data.listName ? data.listName : "";
        this.password1 = data.password1 ? data.password1 : "";
        this.password2 = data.password2 ? data.password2 : "";
        this.populate = data.populate ? data.populate : true;
        this.token = data.token ? data.token : "";
        this.username = data.username ? data.username : "";
    }

    email: string;
    firstName: string;
    lastName: string;
    listName: string;
    password1: string;
    password2: string;
    populate: boolean;
    token: string;                      // Google reCAPTCHA v2 token
    username: string;

}

export default CreateAccount;

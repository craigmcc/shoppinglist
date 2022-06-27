// Share ---------------------------------------------------------------------

// An outstanding offer to share the specified List with a User with the
// specified Email address.

// Internal Modules ----------------------------------------------------------

import List from "./List";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const SHARES_BASE = "/shares";

export class Share {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : null;
        this.admin = (data.admin !== undefined) ? data.admin : true;
        this.email = data.email ? data.email : null;
        this.listId = data.listId ? data.listId : null;
        this.list = data.list ? ToModel.LIST(data.list) : undefined;
        this.token = data.token ? data.token : undefined;
    }

    id: string;
    admin: boolean;
    email: string;
    listId: string;
    token: string;                      // Google reCAPTCHA v2 token

    list: List | undefined;

}

export default Share;

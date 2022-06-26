// Share ---------------------------------------------------------------------

// An outstanding offer to share the specified List with a User with the
// specified Email address.

// Public Objects ------------------------------------------------------------

export class Share {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : null;
        this.admin = (data.admin !== undefined) ? data.admin : true;
        this.email = data.email ? data.email : null;
        this.listId = data.listId ? data.listId : null;
    }

    id: string;
    admin: boolean;
    email: string;
    listId: string;

}

export default Share;

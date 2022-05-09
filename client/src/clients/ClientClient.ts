// ClientClient -----------------------------------------------------------------

// Interact with server side logging operations and related facilities.

// Internal Modules ----------------------------------------------------------

import Api from "./Api";

const CLIENT_BASE = "/client";

// Public Objects ------------------------------------------------------------

class ClientClient {

    // Post a log message to the server
    async log(object: any): Promise<void> {
        await Api.post(CLIENT_BASE + "/clientLog", object);
    }

}

export default new ClientClient();

// ClientServices ------------------------------------------------------------

// Service methods for background requests from clients.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import logger from "../util/ClientLogger";

// Public Objects ------------------------------------------------------------

class ClientServices {

    public async log(record: any): Promise<void> {
        logger.info(record);
    }

}

export default new ClientServices();

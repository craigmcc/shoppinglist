// Client --------------------------------------------------------------------

// Interact with server side logging operations and related facilities.

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// Bypass the normal authorization header handling of Api.
const Client: AxiosInstance = axios.create({
    baseURL: "/api/client",
});

export default Client;

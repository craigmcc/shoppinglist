// OAuth ---------------------------------------------------------------------

// Basic infrastructure for Axios interactions the an OAuth authentication
// server, rooted at "/oauth".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

const OAuth: AxiosInstance = axios.create({
    baseURL: "/oauth",
});

export default OAuth;

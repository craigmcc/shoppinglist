// Api -----------------------------------------------------------------------

// Basic infrastructure for Axios interactions with the API routes of the
// application server, rooted at "/api".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

import {LOGIN_DATA} from "../components/login/LoginContext";

// Public Objects ------------------------------------------------------------

const Api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

Api.interceptors.request.use(function (config) {
    if (LOGIN_DATA.accessToken) {
        // @ts-ignore
        config.headers["Authorization"] = `Bearer ${LOGIN_DATA.accessToken}`;
    }
    if (LOGIN_DATA.username) {
        // @ts-ignore
        config.headers["X-SL-Username"] = LOGIN_DATA.username;
    }
    return config;
});

export default Api;

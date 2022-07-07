// Api -----------------------------------------------------------------------

// Basic infrastructure for Axios interactions with the API routes of the
// application server, rooted at "/api".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

import {LOGIN_DATA_KEY} from "../constants";
import {LoginData} from "../types";
import LocalStorage from "../util/LocalStorage";

const loginData = new LocalStorage<LoginData>(LOGIN_DATA_KEY);

// Public Objects ------------------------------------------------------------

const Api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

Api.interceptors.request.use(function (config) {
    const currentData = loginData.value;
    if (currentData.accessToken) {
        // @ts-ignore
        config.headers["Authorization"] = `Bearer ${currentData.accessToken}`;
    }
    if (currentData.username) {
        // @ts-ignore
        config.headers["X-SL-Username"] = currentData.username;
    }
    return config;
});

export default Api;

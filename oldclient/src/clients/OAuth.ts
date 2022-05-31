// OAuth ---------------------------------------------------------------------

// Basic infrastructure for Axios interactions with an OAuth authentication
// server, rooted at "/oauth".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

import {LOGIN_CONTEXT_DATA_KEY} from "../constants";
import {LoginData} from "../components/login/LoginContext";
import LocalStorage from "../util/LocalStorage";

const loginData = new LocalStorage<LoginData>(LOGIN_CONTEXT_DATA_KEY);

// Public Objects ------------------------------------------------------------

const OAuth: AxiosInstance = axios.create({
    baseURL: "/oauth",
});

OAuth.interceptors.request.use(function (config) {
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

export default OAuth;

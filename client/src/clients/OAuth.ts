// OAuth ---------------------------------------------------------------------

// Basic infrastructure for Axios interactions with an OAuth authentication
// server, rooted at "/oauth".

// External Modules ----------------------------------------------------------

import axios, {AxiosInstance} from "axios";

// Internal Modules ----------------------------------------------------------

import {LOGIN_DATA, LOGIN_CONTEXT_EXTRA_KEY} from "../components/login/LoginContext";
import LocalStorage from "../util/LocalStorage";

const extraData = new LocalStorage(LOGIN_CONTEXT_EXTRA_KEY);

// Public Objects ------------------------------------------------------------

const OAuth: AxiosInstance = axios.create({
    baseURL: "/oauth",
});

OAuth.interceptors.request.use(function (config) {
    console.log("LOGIN_DATA", LOGIN_DATA);
    console.log("EXTRA_DATA", extraData.value);
    if (LOGIN_DATA.accessToken) {
        // @ts-ignore
        config.headers["Authorization"] = `Bearer ${loginData.accessToken}`;
    }
    if (LOGIN_DATA.username) {
        // @ts-ignore
        config.headers["X-SL-Username"] = loginData.username;
    }
    return config;
});

export default OAuth;

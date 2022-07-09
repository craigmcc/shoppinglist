// server --------------------------------------------------------------------

// Server configuration for Mock Service Worker implementations.

// External Modules ----------------------------------------------------------

import {setupServer} from "msw/node";

// Internal Modules ----------------------------------------------------------

import MockListHandlers from "./handlers/MockListHandlers";
import MockUserHandlers from "./handlers/MockUserHandlers";
import {RestHandler} from "msw";

// Public Objects ------------------------------------------------------------

const handlers: RestHandler[] = [
    ...MockListHandlers,
    ...MockUserHandlers,
];

export const server = setupServer(...handlers);

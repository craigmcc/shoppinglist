// ListRouter.test --------------------------------------------------------

// Functional tests for ListRouter that require special seed data loading.

// External Modules ----------------------------------------------------------

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import List from "../models/List";
import RouterUtils, {AUTHORIZATION} from "../test/RouterUtils";
import * as SeedData from "../test/SeedData";
import {CREATED, FORBIDDEN, NOT_FOUND, OK} from "../util/HttpErrors";

const UTILS = new RouterUtils();

// Test Specifications -------------------------------------------------------

describe("ListRouter Special Tests", () => {

    // Test Methods ----------------------------------------------------------

    describe("GET /api/lists/:listId/categories", () => {

        const PATH = "/api/lists/:listId/categories";

        beforeEach("categories#beforeEach", async () => {
            await UTILS.loadData({
                withCategories: true,
                withItems: true,
                withLists: true,
                withUsers: true,
            });
        });

        // TODO

    });

    describe("POST /api/lists/:listId/clear", () => {

        beforeEach("clear#beforeEach", async () => {
            await UTILS.loadData({
                withCategories: true,
                withItems: true,
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/clear";

        // TODO

    });

    describe("GET /api/lists/:listId/items", () => {

        beforeEach("items#beforeEach", async () => {
            await UTILS.loadData({
                withCategories: true,
                withItems: true,
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/items";

        // TODO

    });

    describe("POST /api/lists/:listId/populate", () => {

        beforeEach("populate#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/populate";

        // TODO

    });

    describe("GET /api/lists/:listId/users", () => {

        beforeEach("users#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/users";

        // TODO

    });

    describe("DELETE /api/lists/:listId/users/:userId", () => {

        beforeEach("usersExclude#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/users/:userId";

        // TODO

    });

    describe("POST /api/lists/:listId/users/:userId", () => {

        beforeEach("usersInclude#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/users/:userId";

        // TODO

    })

});

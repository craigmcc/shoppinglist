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
import {FORBIDDEN, OK} from "../util/HttpErrors";

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

        it("should fail on the wrong admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass on authenticated superuser", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass on the right admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass on the right regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

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

        it("should fail on the wrong admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass on authenticated superuser", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        });

        it("should pass on the right admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        });

        it("should pass on the right regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        });

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

        it("should fail on the wrong admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass on authenticated superuser", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass on the right admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass on the right regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

    });

    describe("POST /api/lists/:listId/populate", () => {

        beforeEach("populate#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/populate";

        it("should fail on the right regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass on authenticated superuser", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        });

        it("should pass on the right admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        });

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

        it("should fail on the wrong admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass on authenticated superuser", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass on the right admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass on the right regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

    });

    describe("GET /api/lists/:listId/users", () => {

        beforeEach("users#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/users";

        it("should fail on the wrong admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass on authenticated superuser", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass on the right admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass on the right regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

    });

    describe("DELETE /api/lists/:listId/users/:userId", () => {

        beforeEach("usersExclude#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/users/:userId";

        it("should fail on the right admin user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_REGULAR);

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the right regular user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong admin user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_ADMIN);

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong regular user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass on authenticated superuser", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SECOND_REGULAR);

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

    });

    describe("POST /api/lists/:listId/users/:userId", () => {

        beforeEach("usersInclude#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        const PATH = "/api/lists/:listId/users/:userId";

        it("should fail on the right admin user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_REGULAR);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the right regular user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong admin user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_ADMIN);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on the wrong regular user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass on authenticated superuser", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SECOND_REGULAR);

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id)
                    .replace(":userId", USER.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

    })

});

// Helper Methods ------------------------------------------------------------

const compareLists = (OUTPUT: Partial<List>, INPUT: Partial<List>) => {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.theme).to.equal(INPUT.theme ? INPUT.theme : OUTPUT.theme);
}

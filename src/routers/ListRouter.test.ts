// ListRouter.test --------------------------------------------------------

// Functional tests for ListRouter.

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

describe("ListRouter Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withLists: true,
            withUsers: true,
        });
    })

    // Test Methods ----------------------------------------------------------

    describe("ListRouter GET /api/lists", async () => {

        const PATH = "/api/lists";

        it("should fail on unauthenticated request", async () => {

            const response = await chai.request(app)
                .get(PATH);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.context).to.equal("OAuthMiddleware.requireSuperuser");
            expect(response.body.message).to.equal("No access token presented");

        })

        it("should pass on authenticated superuser", async () => {

            const response = await chai.request(app)
                .get(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.length).to.equal(SeedData.LISTS.length)

        })

    })

    describe("ListRouter POST /api/lists", () => {

        const PATH = "/api/lists";

        it("should fail on unauthenticated request", async () => {

            const INPUT: Partial<List> = {
                name: "Inserted List",
            }

            const response = await chai.request(app)
                .post(PATH)
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.equal("No access token presented");

        })

        it("should pass on authenticated admin", async () => {

            const INPUT: Partial<List> = {
                name: "Inserted List",
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN))
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        })

        it("should pass on authenticated regular", async () => {

            const INPUT: Partial<List> = {
                name: "Inserted List",
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR))
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        })

        it("should pass on authenticated superuser", async () => {

            const INPUT: Partial<List> = {
                name: "Inserted List",
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER))
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        })

    })

    describe("ListRouter DELETE /api/lists/:listId", () => {

        const PATH = "/api/lists/:listId";

        it("should fail on authenticated admin", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on authenticated regular", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on unauthenticated request", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", "" + INPUT.id));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.equal("No access token presented");

        })

        it("should pass on authenticated superuser", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            // Perform the remove
            const response1 = await chai.request(app)
                .delete(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response1).to.have.status(OK);
            const OUTPUT: Partial<List> = response1.body;
            compareLists(OUTPUT, INPUT);

            // Verify that the remove was completed
            const response2 = await chai.request(app)
                .get(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            // Lists are a special case - normally would just expect NOT_FOUND
            if ((response2.status !== FORBIDDEN) && (response2.status !== NOT_FOUND)) {
                expect.fail(`GET /api/lists/${INPUT.id} returns ${response2.status} instead of 403 or 404`);
            }

        })

    })

    describe("ListRouter GET /api/lists/:listId", () => {

        const PATH = "/api/lists/:listId";

        it("should fail on the wrong admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on the wrong regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should pass on authenticated superuser", async () => { // TODO - SUPERUSER_SCOPE not set in tests ???

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        })

        it("should pass on the right admin user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        })

        it("should pass on the right regular user", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", "" + INPUT.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        })

    })

    describe("ListRouter PUT /api/lists/:listId", () => {

        const PATH = "/api/lists/:listId";

        it("should fail on the right regular user", async () => {

            const ORIGINAL = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUT: Partial<List> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":listId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on the wrong admin user", async () => {

            const ORIGINAL = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUT: Partial<List> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":listId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should fail on the wrong regular user", async () => {

            const ORIGINAL = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUT: Partial<List> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":listId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        })

        it("should pass on authenticated superuser", async () => { // TODO - SUPERUSER_SCOPE not set in tests ???

            const ORIGINAL = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUT: Partial<List> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":listId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_SUPERUSER))
                .send(INPUT);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        })

        it("should pass on the right admin user", async () => {

            const ORIGINAL = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUT: Partial<List> = {
                name: "Updated Name",
            }

            const response = await chai.request(app)
                .put(PATH.replace(":listId", "" + ORIGINAL.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN))
                .send(INPUT);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            compareLists(response.body, INPUT);

        })

    })

})

// Helper Methods ------------------------------------------------------------

const compareLists = (OUTPUT: Partial<List>, INPUT: Partial<List>) => {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.theme).to.equal(INPUT.theme ? INPUT.theme : OUTPUT.theme);
}

// CategoryRouter.test -----------------------------------------------------------

// Functional tests for CategoryRouter.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import Category from "../models/Category";
import CategoryServices from "../services/CategoryServices";
import RouterUtils, {AUTHORIZATION} from "../test/RouterUtils";
import * as SeedData from "../test/SeedData";
import {CREATED, FORBIDDEN, NOT_FOUND, OK} from "../util/HttpErrors";

const UTILS = new RouterUtils();

// Test Specifications -------------------------------------------------------

describe("CategoryRouter Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withCategories: true,
            withLists: true,
            withUsers: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("CategoryRouter GET /api/categories/:listId/exact/:name", () => {

        const PATH = "/api/categories/:listId/exact/:name";

        it("should fail (404) with invalid name", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_REGULAR;
            const CATEGORY_NAME = "Invalid Category Name";

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":name", CATEGORY_NAME))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(NOT_FOUND);
            expect(response).to.be.json;
            expect(response.body.message).to.include(`name: Missing Category '${CATEGORY_NAME}'`);

        });

        it("should fail (403) with unauthenticated request", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const CATEGORY_NAME = SeedData.CATEGORY_NAME_SECOND;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":name", CATEGORY_NAME));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("No access token presented");

        });

        it("should fail (403) with wrong list User", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_REGULAR;
            const CATEGORY_NAME = SeedData.CATEGORY_NAME_THIRD;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":name", CATEGORY_NAME))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass with authenticated admin", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_ADMIN;
            const CATEGORY_NAME = SeedData.CATEGORY_NAME_THIRD;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":name", CATEGORY_NAME))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.name).to.equal(CATEGORY_NAME);

        });

        it("should pass with authenticated regular", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER_USERNAME = SeedData.USER_USERNAME_THIRD_REGULAR;
            const CATEGORY_NAME = SeedData.CATEGORY_NAME_FIRST;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":name", CATEGORY_NAME))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.name).to.equal(CATEGORY_NAME);

        });

        it("should pass with authenticated superuser", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER_USERNAME = SeedData.USER_USERNAME_SUPERUSER;
            const CATEGORY_NAME = SeedData.CATEGORY_NAME_SECOND;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":name", CATEGORY_NAME))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.name).to.equal(CATEGORY_NAME);

        });

    });

    describe("CategoryRouter GET /ap/categories/:listId", () => {

        const PATH = "/api/categories/:listId";

        it("should fail (403) with unauthenticated request", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("No access token presented");

        });

        it("should fail (403) with wrong list User", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_REGULAR;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass with authenticated admin", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_ADMIN;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const OUTPUTS: Category[] = response.body;
            expect(OUTPUTS.length).to.equal(SeedData.CATEGORIES.length);

        });

        it("should pass with authenticated regular", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER_USERNAME = SeedData.USER_USERNAME_THIRD_REGULAR;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const OUTPUTS: Category[] = response.body;
            expect(OUTPUTS.length).to.equal(SeedData.CATEGORIES.length);

        });

        it("should pass with authenticated superuser", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER_USERNAME = SeedData.USER_USERNAME_SUPERUSER;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const OUTPUTS: Category[] = response.body;
            expect(OUTPUTS.length).to.equal(SeedData.CATEGORIES.length);

        });

    });

    describe("CategoryRouter POST /api/categories/:listId", () => {

        const PATH = "/api/categories/:listId";

        it("should fail (403) with authenticated regular", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER_USERNAME = SeedData.USER_USERNAME_THIRD_REGULAR;
            const INPUT = {
                name: "Inserted Category",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail (403) with unauthenticated request", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const INPUT = {
                name: "Inserted Category",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("No access token presented");

        });

        it("should fail (403) with wrong list User", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_THIRD_REGULAR;
            const INPUT = {
                name: "Inserted Category",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass with authenticated admin", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_ADMIN;
            const INPUT = {
                name: "Inserted Category",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME))
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            expect(response.body.id).to.exist;
            expect(response.body.name).to.equal(INPUT.name);

        });

        it("should pass with authenticated superuser", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER_USERNAME = SeedData.USER_USERNAME_SUPERUSER;
            const INPUT = {
                name: "Inserted Category",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", LIST.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME))
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            expect(response.body.id).to.exist;
            expect(response.body.name).to.equal(INPUT.name);

        });

    });

    describe("CategoryRouter DELETE /api/categories/:listId/:listId", () => {

        const PATH = "/api/categories/:listId/:categoryId";

        it("should fail (403) with authenticated regular", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER_USERNAME = SeedData.USER_USERNAME_THIRD_REGULAR;
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail (403) with unauthenticated request", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("No access token presented");

        });

        it("should fail (403) with wrong list user", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_ADMIN;
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass with authenticated admin", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_ADMIN;
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(CATEGORY_ID);

        });

        it("should pass with authenticated superuser", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER_USERNAME = SeedData.USER_USERNAME_SUPERUSER;
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .delete(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(CATEGORY_ID);

        });

    });

    describe("CategoryRouter GET /api/categories/:listId/:categoryId", () => {

        const PATH = "/api/categories/:listId/:categoryId";

        it("should fail (403) with unauthenticated request", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("No access token presented");

        });

        it("should fail (403) with wrong list User", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_ADMIN;
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass with authenticated admin", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_ADMIN;
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(CATEGORY_ID);

        });

        it("should pass with authenticated regular", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER_USERNAME = SeedData.USER_USERNAME_THIRD_REGULAR;
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(CATEGORY_ID);

        });

        it("should pass with authenticated superuser", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER_USERNAME = SeedData.USER_USERNAME_SUPERUSER;
            const INPUTS = await CategoryServices.all(LIST.id);
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .get(PATH.replace(":listId", LIST.id)
                    .replace(":categoryId", CATEGORY_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(CATEGORY_ID);

        });

    });

    describe("CategoryRouter PUT /api/categories/:listId/:categoryId", () => {

        const PATH = "/api/categories/:listId/:listId";

        it("should fail (403) with authenticated regular", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_REGULAR;
            const INPUTS = await CategoryServices.all(LIST.id);
            const INPUT = INPUTS[0];
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .put(PATH.replace(":listId", LIST.id)
                    .replace(":listId", CATEGORY_ID), INPUT)
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail (403) with unauthenticated request", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUTS = await CategoryServices.all(LIST.id);
            const INPUT = INPUTS[0];
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .put(PATH.replace(":listId", LIST.id)
                    .replace(":listId", CATEGORY_ID), INPUT)
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("No access token presented");

        });

        it("should fail (403) with wrong list User", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_THIRD_ADMIN;
            const INPUTS = await CategoryServices.all(LIST.id);
            const INPUT = INPUTS[0];
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .put(PATH.replace(":listId", LIST.id)
                    .replace(":listId", CATEGORY_ID), INPUT)
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME))
                .send(INPUT);
            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass with authenticated admin", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const USER_USERNAME = SeedData.USER_USERNAME_FIRST_ADMIN;
            const INPUTS = await CategoryServices.all(LIST.id);
            const INPUT = INPUTS[0];
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .put(PATH.replace(":listId", LIST.id)
                    .replace(":listId", CATEGORY_ID), INPUT)
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME))
                .send(INPUT);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(CATEGORY_ID);

        });

        it("should pass with authenticated superuser", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USER_USERNAME = SeedData.USER_USERNAME_SUPERUSER;
            const INPUTS = await CategoryServices.all(LIST.id);
            const INPUT = INPUTS[0];
            const CATEGORY_ID = INPUTS[0].id;

            const response = await chai.request(app)
                .put(PATH.replace(":listId", LIST.id)
                    .replace(":listId", CATEGORY_ID), INPUT)
                .set(AUTHORIZATION, await UTILS.credentials(USER_USERNAME))
                .send(INPUT);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(CATEGORY_ID);

        });

    });

    describe("CategoryRouter GET /api/categories/:listId/:categoryId/items", () => {

        const PATH = "/api/categories/:listId/:categoryId/items";

        // TODO - these need items to get loaded as well

    });

});


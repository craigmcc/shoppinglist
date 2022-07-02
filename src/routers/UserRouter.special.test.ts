// ListRouter.test --------------------------------------------------------

// Functional tests for ListRouter that require special seed data loading.

// External Modules ----------------------------------------------------------

// External Modules ----------------------------------------------------------

import CreateAccount from "../models/CreateAccount";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import AccessToken from "../models/AccessToken";
import List from "../models/List";
import User from "../models/User";
import {ADMIN_PERMISSION, REGULAR_PERMISSION} from "../oauth/OAuthMiddleware";
import {TEST_MODE_TOKEN} from "../services/CaptchaServices";
import RouterUtils, {AUTHORIZATION} from "../test/RouterUtils";
import * as SeedData from "../test/SeedData";
import {CREATED, OK} from "../util/HttpErrors";

const UTILS = new RouterUtils();

// Test Specifications -------------------------------------------------------

describe("UserRouter Special Tests", () => {

    // Test Methods ----------------------------------------------------------

    // TODO - will need to be revised when ReCAPTCHA is implemented
    // TODO - will need to be revised if populate option is passed in
    describe("POST /api/users/accounts", () => {

        const PATH = "/api/users/accounts";

        beforeEach("accounts#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should pass on valid data with list", async () => {

            const INPUT = new CreateAccount({
                email: "newuser@example.com",
                firstName: "New",
                lastName: "User",
                listName: SeedData.LIST_NAME_SECOND,    // Not required to be unique
                password1: "newpass",
                password2: "newpass",
                token: TEST_MODE_TOKEN,
                username: "newuser",
            });

            const response = await chai.request(app)
                .post(PATH)
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            expect(response.body.username).to.equal(INPUT.username);

        });

        it("should pass on valid data without list", async () => {

            const INPUT = new CreateAccount({
                email: "newuser@example.com",
                firstName: "New",
                lastName: "User",
                listName: SeedData.LIST_NAME_SECOND,    // Not required to be unique
                password1: "newpass",
                password2: "newpass",
                token: TEST_MODE_TOKEN,
                username: "newuser",
            });

            const response = await chai.request(app)
                .post(PATH)
                .send(INPUT);
            expect(response).to.have.status(CREATED);
            expect(response).to.be.json;
            expect(response.body.username).to.equal(INPUT.username);

        });

    });

    describe("GET /api/users/:userId/lists", () => {

        const PATH = "/api/users/:userId/lists";

        beforeEach("lists#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should pass on the right admin user", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN);

            const response = await chai.request(app)
                .get(PATH.replace(":userId", USER.id) + "?withUsers")
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const LISTS = response.body as List[];
            LISTS.forEach(LIST => {
                expect(LIST.users).to.exist;
                expect(LIST.users.length).to.be.greaterThan(0);
                let found = false;
                LIST.users.forEach(LIST_USER => {
                    if (LIST_USER.id === USER.id) {
                        found = true;
                    }
                });
                expect(found).to.be.true;
            });

        })

        it("should pass on the right regular user", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);

            const response = await chai.request(app)
                .get(PATH.replace(":userId", USER.id) + "?withUsers")
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR));
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const LISTS = response.body as List[];
            LISTS.forEach(LIST => {
                expect(LIST.users).to.exist;
                expect(LIST.users.length).to.be.greaterThan(0);
                let found = false;
                LIST.users.forEach(LIST_USER => {
                    if (LIST_USER.id === USER.id) {
                        found = true;
                    }
                });
                expect(found).to.be.true;
            });

        })

    });

    describe("POST /api/users/:userId/lists", () => {

        const PATH = "/api/users/:userId/lists";

        beforeEach("listsInsert#beforeEach", async () => {
            await UTILS.loadData({
                // No preloaded Lists for these tests
                withUsers: true,
            });
        });

        it("should pass on the right admin user", async () => {

            const USER_IN = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN);
            const LIST_IN: Partial<List> = {
                name: "New List",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":userId", USER_IN.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_ADMIN))
                .send(LIST_IN);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const LIST_OUT = response.body as List;
            expect(LIST_OUT.name).to.equal(LIST_IN.name);

            const USER_OUT = await User.findByPk(USER_IN.id, {
                include: [ List ],
            });
            expect(USER_OUT).to.exist;
            expect(USER_OUT?.lists).to.exist;
            expect(USER_OUT?.lists.length).to.equal(1);
            expect(USER_OUT?.lists[0].name).to.equal(LIST_IN.name);

            const ACCESS_TOKEN = await AccessToken.findOne({
                where: { userId: USER_IN.id }
            });
            expect(ACCESS_TOKEN).to.exist;
            expect(ACCESS_TOKEN?.scope).to.include(`${ADMIN_PERMISSION}:${LIST_OUT.id}`);

        });

        it("should pass on the right regular user", async () => {

            const USER_IN = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);
            const LIST_IN: Partial<List> = {
                name: "New List",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":userId", USER_IN.id))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR))
                .send(LIST_IN);
            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            const LIST_OUT = response.body as List;
            expect(LIST_OUT.name).to.equal(LIST_IN.name);

            const USER_OUT = await User.findByPk(USER_IN.id, {
                include: [ List ],
            });
            expect(USER_OUT).to.exist;
            expect(USER_OUT?.lists).to.exist;
            expect(USER_OUT?.lists.length).to.equal(1);
            expect(USER_OUT?.lists[0].name).to.equal(LIST_IN.name);

            const ACCESS_TOKEN = await AccessToken.findOne({
                where: { userId: USER_IN.id }
            });
            expect(ACCESS_TOKEN).to.exist;
            expect(ACCESS_TOKEN?.scope).to.include(`${ADMIN_PERMISSION}:${LIST_OUT.id}`);

        });

    });

});

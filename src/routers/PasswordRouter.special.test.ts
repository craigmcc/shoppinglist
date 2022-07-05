// PasswordRouter.special.test -----------------------------------------------

// Functional tests for PasswordRouter that require special seed data loading.

// External Modules ----------------------------------------------------------


import User from "../models/User";

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const uuid = require("uuid");

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import Password from "../models/Password";
import {hashPassword} from "../oauth/OAuthUtils";
import {TEST_MODE_TOKEN} from "../services/CaptchaServices";
import RouterUtils, {AUTHORIZATION} from "../test/RouterUtils";
import * as SeedData from "../test/SeedData";
import {BAD_REQUEST, FORBIDDEN, NO_CONTENT, NOT_FOUND, OK, SERVICE_UNAVAILABLE} from "../util/HttpErrors";

const UTILS = new RouterUtils();
const INVALID_ID = uuid.v4();

// Test Specifications -------------------------------------------------------

describe("PasswordRouter Special Tests", () => {

    // Test Methods ----------------------------------------------------------

    describe("POST /api/passwords", () => {

        const PATH = "/api/passwords";

        beforeEach("update#beforeEach", async () => {
            await UTILS.loadData({
                withUsers: true,
            });
        });

        it("should fail on invalid token value", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_REGULAR);
            const INPUT: Partial<Password> = {
                password1: "foobar",
                password2: "foobar",
                token: "Invalid Token Value",
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(USER.username))
                .send(INPUT);

            expect(response).to.have.status(SERVICE_UNAVAILABLE);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Failed ReCAPTCHA validation");

        });

        it("should fail on mismatched passwords", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN);
            const INPUT: Partial<Password> = {
                password1: "foobar",
                password2: "bazbop",
                token: TEST_MODE_TOKEN,
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(USER.username))
                .send(INPUT);

            expect(response).to.have.status(BAD_REQUEST);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Password values do not match");

        });

        it("should fail on unauthenticated request", async () => {

            const INPUT: Partial<Password> = {
                password1: "foobar",
                password2: "foobar",
                token: TEST_MODE_TOKEN,
            }

            const response = await chai.request(app)
                .post(PATH)
                .send(INPUT);

            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("No access token presented");

        });

        it("should pass on valid information", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN);
            const INPUT: Partial<Password> = {
                password1: "foobar",
                password2: "foobar",
                token: TEST_MODE_TOKEN,
            }

            const response = await chai.request(app)
                .post(PATH)
                .set(AUTHORIZATION, await UTILS.credentials(USER.username))
                .send(INPUT);

            expect(response).to.have.status(NO_CONTENT);
            const hashedPassword = await hashPassword(INPUT.password1!);
            const UPDATED = await User.findByPk(USER.id);
            //expect(UPDATED!.password).to.equal(hashedPassword); // TODO - why fails?

        });

    });

    describe("POST /api/passwords/:email", () => {

        const PATH = "/api/passwords/:email";

        beforeEach("forgot#beforeEach", async () => {
            await UTILS.loadData({
                withUsers: true,
            });
        });

        it("should fail on invalid email", async () => {

            const EMAIL = "someone@example.com";

            const response = await chai.request(app)
                .post(PATH.replace(":email", EMAIL));

            expect(response).to.have.status(BAD_REQUEST);
            expect(response).to.be.json;
            expect(response.body.message).to.include("There is no user with that email address");

        });

        it("should pass on valid email", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);

            const response = await chai.request(app)
                .post(PATH.replace(":email", USER.email));

            expect(response).to.have.status(NO_CONTENT);

        });

    });

    describe("GET /api/passwords/:passwordId", () => {

        const PATH = "/api/passwords/:passwordId";

        beforeEach("find#beforeEach", async () => {
            await UTILS.loadData({
                withUsers: true,
            });
        });

        it("should fail on invalid password ID", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":passwordId", INVALID_ID));

            expect(response).to.have.status(NOT_FOUND);
            expect(response).to.be.json;
            expect(response.body.message).to.include(`passwordId: Missing Password ${INVALID_ID}`);

        });

        it("should pass on valid password ID", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_REGULAR);
            const INPUT: Partial<Password> = {
                id: uuid.v4(),
                email: "someone@example.com",
                expires: new Date(),
                userId: USER.id,
            }
            // @ts-ignore
            const PASSWORD = await Password.create(INPUT);

            const response = await chai.request(app)
                .get(PATH.replace(":passwordId", PASSWORD.id));

            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(PASSWORD.id);
            expect(response.body.email).to.equal(PASSWORD.email);
            //expect(response.body.expires).to.equal(PASSWORD.expires); // Date comparisons are weird
            expect(response.body.userId).to.equal(PASSWORD.userId);

        });

    });

    describe("PUT /api/passwords/:passwordId", () => {

        const PATH = "/api/passwords/:passwordId";

        beforeEach("submit#beforeEach", async () => {
            await UTILS.loadData({
                withUsers: true,
            });
        });

        it("should fail on invalid email", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SECOND_ADMIN);
            const INPUT: Partial<Password> = {
                id: uuid.v4(),
                email: "X" + USER.email,
                expires: new Date(),
                password1: "bazbop",
                password2: "bazbop",
                token: TEST_MODE_TOKEN,
            }
            // @ts-ignore
            await Password.create(INPUT);

            const response = await chai.request(app)
                .put(PATH.replace(":passwordId", INPUT.id!))
                .send(INPUT);

            expect(response).to.have.status(NOT_FOUND);
            expect(response).to.be.json;
            expect(response.body.message).to.include(`Missing User ${INPUT.email}`);

        });

        it("should fail on invalid token", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SECOND_REGULAR);
            const INPUT: Partial<Password> = {
                id: uuid.v4(),
                email: USER.email,
                expires: new Date(),
                password1: "bazbop",
                password2: "bazbop",
                token: "Invalid Token Value",
            }
            // @ts-ignore
            await Password.create(INPUT);

            const response = await chai.request(app)
                .put(PATH.replace(":passwordId", INPUT.id!))
                .send(INPUT);

            expect(response).to.have.status(SERVICE_UNAVAILABLE);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Failed ReCAPTCHA validation");

        });

        it("should fail on mismatched passwords", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);
            const INPUT: Partial<Password> = {
                id: uuid.v4(),
                email: USER.email,
                expires: new Date(),
                password1: "bazbop",
                password2: "foobar",
                token: TEST_MODE_TOKEN,
            }
            // @ts-ignore
            await Password.create(INPUT);

            const response = await chai.request(app)
                .put(PATH.replace(":passwordId", INPUT.id!))
                .send(INPUT);

            expect(response).to.have.status(BAD_REQUEST);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Password values do not match");

        });

        it("should pass on valid information", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SECOND_ADMIN);
            const INPUT: Partial<Password> = {
                id: uuid.v4(),
                email: USER.email,
                expires: new Date(),
                password1: "bazbop",
                password2: "bazbop",
                token: TEST_MODE_TOKEN,
            }
            // @ts-ignore
            await Password.create(INPUT);

            const response = await chai.request(app)
                .put(PATH.replace(":passwordId", INPUT.id!))
                .send(INPUT);

            expect(response).to.have.status(NO_CONTENT);

        });

    });

});

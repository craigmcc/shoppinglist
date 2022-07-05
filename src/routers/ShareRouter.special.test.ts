// ShareRouter.special.test --------------------------------------------------

// Functional tests for ShareRouter that require special seed data loading.

// External Modules ----------------------------------------------------------


const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const uuid = require("uuid");

// Internal Modules ----------------------------------------------------------

import app from "./ExpressApplication";
import Share from "../models/Share";
import {TEST_MODE_TOKEN} from "../services/CaptchaServices";
import RouterUtils, {AUTHORIZATION} from "../test/RouterUtils";
import * as SeedData from "../test/SeedData";
import {BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK, SERVICE_UNAVAILABLE} from "../util/HttpErrors";

const UTILS = new RouterUtils();
const INVALID_ID = uuid.v4();

// Test Specifications -------------------------------------------------------

describe("ShareRouter Special Tests", () => {

    // Test Methods ----------------------------------------------------------

    describe("GET /api/shares/:shareId", () => {

        const PATH = "/api/shares/:shareId";

        beforeEach("find#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail on invalid Share ID", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":shareId", INVALID_ID))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR));

            expect(response).to.have.status(NOT_FOUND);
            expect(response).to.be.json;
            expect(response.body.message).to.include(`shareId: Missing Share ${INVALID_ID}`);

        });

        it("should fail on unauthenticated request", async () => {

            const response = await chai.request(app)
                .get(PATH.replace(":shareId", INVALID_ID));

            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.context).to.equal("OAuthMiddleware.requireUser");
            expect(response.body.message).to.equal("No access token presented");

        });

        it("should pass on valid information", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN, true);
            // @ts-ignore
            const SHARE = await Share.create({
                id: uuid.v4(),
                admin: true,
                email: "someone@example.com",
                expires: new Date,
                listId: USER.lists[0].id,
            })

            const response = await chai.request(app)
                .get(PATH.replace(":shareId", SHARE.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER.username));

            expect(response).to.have.status(OK);
            expect(response).to.be.json;
            expect(response.body.id).to.equal(SHARE.id);

        });

    });

    describe("POST /api/shares/:shareId", () => {

        const PATH = "/api/shares/:shareId";

        beforeEach("find#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail on invalid reCAPTCHA token", async () => {

            const INPUT: Partial<Share> = {
                token: "Invalid reCAPTCHA Token",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":shareId", INVALID_ID))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_THIRD_REGULAR))
                .send(INPUT);

            expect(response).to.have.status(SERVICE_UNAVAILABLE);
            expect(response).to.be.json;
            expect(response.body.message).to.include(`Failed ReCAPTCHA validation`);

        });

        it("should fail on invalid Share ID", async () => {

            const INPUT: Partial<Share> = {
                token: TEST_MODE_TOKEN,
            }

            const response = await chai.request(app)
                .post(PATH.replace(":shareId", INVALID_ID))
                .set(AUTHORIZATION, await UTILS.credentials(SeedData.USER_USERNAME_FIRST_REGULAR))
                .send(INPUT);

            expect(response).to.have.status(NOT_FOUND);
            expect(response).to.be.json;
            expect(response.body.message).to.include(`Missing Share ${INVALID_ID}`);

        });

        it("should fail on invalid User email", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR, true);
            const INPUT: Partial<Share> = {
                id: uuid.v4(),
                admin: true,
                email: "x" + USER.email,
                expires: new Date(),
                listId: USER.lists[0].id,
                token: TEST_MODE_TOKEN,
            }
            // @ts-ignore
            const SHARE = await Share.create(INPUT);

            const response = await chai.request(app)
                .post(PATH.replace(":shareId", SHARE.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER.username))
                .send(INPUT);

            expect(response).to.have.status(BAD_REQUEST);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Invite was for a different email address");

        });

        it("should fail on unauthenticated request", async () => {

            const response = await chai.request(app)
                .post(PATH.replace(":shareId", INVALID_ID))
                .send({});

            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.context).to.equal("OAuthMiddleware.requireUser");
            expect(response.body.message).to.equal("No access token presented");

        });

        it("should pass on valid information", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR, true);
            const INPUT: Partial<Share> = {
                id: uuid.v4(),
                admin: true,
                email: USER.email,
                expires: new Date(),
                listId: USER.lists[0].id,
                token: TEST_MODE_TOKEN,
            }
            // @ts-ignore
            const SHARE = await Share.create(INPUT);

            const response = await chai.request(app)
                .post(PATH.replace(":shareId", SHARE.id))
                .set(AUTHORIZATION, await UTILS.credentials(USER.username))
                .send(INPUT);

            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

    });

    describe("POST /api/shares/:listId/offer", () => {

        const PATH = "/api/shares/:listId/offer";

        beforeEach("find#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail on invalid list ID", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN);
            const INPUT: Partial<Share> = {
                admin: false,
                email: "someone@example.com",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", INVALID_ID))
                .set(AUTHORIZATION, await UTILS.credentials(USER.username))
                .send(INPUT);

            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on right authenticated regular user", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_REGULAR, true);
            const INPUT: Partial<Share> = {
                admin: false,
                email: "someone@example.com",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", USER.lists[0].id))
                .set(AUTHORIZATION, await UTILS.credentials(USER.username))
                .send(INPUT);

            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should fail on unauthenticated request", async () => {

            const response = await chai.request(app)
                .post(PATH.replace(":shareId", INVALID_ID))
                .send({});

            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.context).to.equal("OAuthMiddleware.requireAdmin");
            expect(response.body.message).to.equal("No access token presented");

        });

        it("should fail on wrong authenticated admin user", async () => {

            const USER_OWNER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN, true);
            const USER_OFFEROR = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_ADMIN);
            const INPUT: Partial<Share> = {
                admin: false,
                email: "someone@example.com",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", USER_OWNER.lists[0].id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_OFFEROR.username))
                .send(INPUT);

            expect(response).to.have.status(FORBIDDEN);
            expect(response).to.be.json;
            expect(response.body.message).to.include("Required scope not authorized");

        });

        it("should pass with valid information for a new User", async () => {

            const USER_OFFEROR = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN, true);
            const INPUT: Partial<Share> = {
                admin: true,
                email: "someone@example.com",
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", USER_OFFEROR.lists[0].id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_OFFEROR.username))
                .send(INPUT);

            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

        it("should pass with valid information for an existing User", async () => {

            const USER_OFFEROR = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_ADMIN, true);
            const USER_OFFEREE = await UTILS.lookupUser(SeedData.USER_USERNAME_SECOND_REGULAR);
            const INPUT: Partial<Share> = {
                admin: true,
                email: USER_OFFEREE.email,
            }

            const response = await chai.request(app)
                .post(PATH.replace(":listId", USER_OFFEROR.lists[0].id))
                .set(AUTHORIZATION, await UTILS.credentials(USER_OFFEROR.username))
                .send(INPUT);

            expect(response).to.have.status(OK);
            expect(response).to.be.json;

        });

    });

});

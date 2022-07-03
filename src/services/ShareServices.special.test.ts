// ShareServices.special.test ------------------------------------------------

// Functional tests for ShareServices that require special seed data loading.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
const uuid = require("uuid");

// Internal Modules ----------------------------------------------------------

import ShareServices from "./ShareServices";
import Share from "../models/Share";
import {TEST_MODE_TOKEN} from "./CaptchaServices";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound, ServiceUnavailable} from "../util/HttpErrors";

const UTILS = new ServicesUtils();
const INVALID_ID = UTILS.invalidId();

// Test Specifications -------------------------------------------------------

describe("ShareServices Special Tests", () => {

    // Test Methods ----------------------------------------------------------

    describe("ShareServices.accept()", () => {

        beforeEach("accept#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail on invalid token", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);
            const SHARE: Partial<Share> = {
                id: uuid.v4(),
                admin: true,
                email: "foo@example.com",
                expires: new Date(),
                listId: LIST.id,
                token: "Invalid Token Value",
            }

            try {
                // @ts-ignore
                await ShareServices.accept(INVALID_ID, SHARE, USER);
                expect.fail("Should have thrown ServiceUnavailable");
            } catch (error) {
                if (error instanceof ServiceUnavailable) {
                    expect(error.message).to.include("Failed ReCAPTCHA validation");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on mismatched email", async () => {

            const USER_FROM = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN, true);
            const LIST = USER_FROM.lists[0];
            const USER_TO = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);
            const INPUT: Partial<Share> = {
                id: uuid.v4(),
                admin: true,
                email: USER_TO.email,
                expires: new Date(),
                listId: LIST.id,
                token: TEST_MODE_TOKEN,
            }
            // @ts-ignore
            const SHARE = await Share.create(INPUT);

            try {
                // @ts-ignore
                await ShareServices.accept(INPUT.id, {
                    ...INPUT,
                    email: "unknown@example.com",
                }, USER_TO);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("Invite was for a different email address");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on missing Share", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);
            const SHARE: Partial<Share> = {
                id: uuid.v4(),
                admin: true,
                email: "foo@example.com",
                expires: new Date(),
                listId: LIST.id,
                token: TEST_MODE_TOKEN,
            }

            try {
                // @ts-ignore
                await ShareServices.accept(INVALID_ID, SHARE, USER);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`Missing Share ${INVALID_ID}`);
                } else {
                    expect.fail("Should have thrown NotFound");
                }
            }

        });

        it("should pass on valid information", async () => {

            const USER_FROM = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN, true);
            const LIST = USER_FROM.lists[0];
            const USER_TO = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);
            const INPUT: Partial<Share> = {
                id: uuid.v4(),
                admin: true,
                email: USER_TO.email,
                expires: new Date(),
                listId: LIST.id,
                token: TEST_MODE_TOKEN,
            }
            // @ts-ignore
            const SHARE = await Share.create(INPUT);

            try {
                // @ts-ignore
                await ShareServices.accept(INPUT.id, INPUT, USER_TO);
                const USER_TO_AFTER = await UTILS.lookupUser(USER_TO.username, true);
                let found = false;
                USER_TO_AFTER.lists.forEach(list => {
                    if (list.id === LIST.id) {
                        found = true;
                    }
                });
                expect(found).to.be.true;
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }

        });

    });

    describe("ShareServices.find()", () => {

        beforeEach("find#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("Should fail on invalid Share ID", async () => {

            try {
                await ShareServices.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`Missing Share ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("Should pass on valid Share ID", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUT: Partial<Share> = {
                id: uuid.v4(),
                admin: true,
                email: "foo@example.com",
                expires: new Date(),
                listId: LIST.id,
                token: TEST_MODE_TOKEN,
            }
            // @ts-ignore
            await Share.create(INPUT);

            // @ts-ignore
            const OUTPUT = await ShareServices.find(INPUT.id);
            expect(OUTPUT.id).to.equal(INPUT.id);
            expect(OUTPUT.admin).to.equal(INPUT.admin);
            expect(OUTPUT.email).to.equal(INPUT.email);
            //expect(OUTPUT.expires).to.equal(INPUT.expires); // DATE comparisons are weird
            expect(OUTPUT.listId).to.equal(INPUT.listId);
            //expect(OUTPUT.token).to.equal(INPUT.token); // token is not persisted

        });

    });

    describe("ShareServices.offer()", () => {

        beforeEach("offer#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail with invalid list ID", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR, true);
            const INPUT: Partial<Share> = {
                admin: true,
                email: "another.user@example.com",
                expires: new Date(),
            }

            try {
                // @ts-ignore
                await ShareServices.offer(INVALID_ID, INPUT);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`Missing List ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass with valid information", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR, true);
            const INPUT: Partial<Share> = {
                admin: true,
                email: "another.user@example.com",
                expires: new Date(),
            }

            try {
                // @ts-ignore
                const OUTPUT = await ShareServices.offer(USER.lists[0].id, INPUT);
                expect(OUTPUT.admin).to.equal(INPUT.admin);
                expect(OUTPUT.email).to.equal(INPUT.email);
                //expect(OUTPUT.expires).to.equal(INPUT.expires); // Date comparisons are weird
                expect(OUTPUT.listId).to.equal(USER.lists[0].id);
            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }

        })

    });

});

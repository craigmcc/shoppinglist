// UserServices.test ---------------------------------------------------------

// Functional tests for UserServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import UserServices from "./UserServices";
import User from "../models/User";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();
const INVALID_ID = UTILS.invalidId();

// Test Specifications ------------------------------------------------------

describe("UserServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withAccessTokens: true,
            withLists: true,
            withRefreshTokens: true,
            withUsers: true,
        });
    });

    // Test Methods ---------------------------------------------------------

    describe("UserServices.all()", () => {

        it("should pass on active Users", async () => {

            const users = await UserServices.all({ active: "" });
            users.forEach(user => {
                expect(user.active).to.be.true;
            });

        });

        it("should pass on all Users", async () => {

            const users = await UserServices.all();
            expect(users.length).to.equal(SeedData.USERS.length);

        });

        it("should pass on named Users", async () => {

            const PATTERN = "AdM";  // Should match on "admin"

            const users = await UserServices.all({ username: PATTERN });
            expect(users.length).to.be.greaterThan(0);
            expect(users.length).to.be.lessThan(SeedData.USERS.length);
            users.forEach(user => {
                expect(user.username.toLowerCase()).to.include(PATTERN.toLowerCase());
            });

        });

        it("should pass on paginated Users", async () => {

            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await UserServices.all();

            const OUTPUTS = await UserServices.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.be.lessThanOrEqual(LIMIT);
            expect(OUTPUTS.length).to.equal(SeedData.USERS.length - OFFSET);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareUserOld(OUTPUT, INPUTS[index + OFFSET]);
            });

        });

    });

    describe("UserServices.exact()", () => {

        it("should fail on invalid username", async () => {

            const INVALID_USERNAME = "abra cadabra";

            try {
                await UserServices.exact(INVALID_USERNAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`username: Missing User '${INVALID_USERNAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid usernames", async () => {

            const INPUTS = await UserServices.all();

            INPUTS.forEach(async (INPUT) => {
                const OUTPUT = await UserServices.exact(INPUT.username);
                expect(OUTPUT.id).to.equal(INPUT.id);
            });

        });

    });

    describe("UserServices.find()", () => {

        it("should fail on invalid ID", async () => {

            try {
                await UserServices.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`userId: Missing User ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid IDs", async () => {

            const INPUTS = await UserServices.all();

            INPUTS.forEach(async (INPUT) => {
                const OUTPUT = await UserServices.find(INPUT.id);
                expect(OUTPUT.id).to.equal(INPUT.id);
                expect(OUTPUT.password).to.equal("");
            });

        });

    });

    describe("UserServices.insert()", () => {

        it("should fail on duplicate username", async () => {

            const EXISTING = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            const INPUT = {
                firstName: "dummy",
                lastName: "dummy",
                password: "dummy",
                scope: "dummy",
                username: EXISTING.username,
            };

            try {
                await UserServices.insert(INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("is already in use");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid input data", async () => {

            const INPUT = {};

            try {
                await UserServices.insert(INPUT);
                expect.fail(`Should have thrown BadRequest`);
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("Is required");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid input data", async () => {

            const INPUT = {
                active: true,
                firstName: "Inserted",
                lastName: "User",
                password: "insertedpassword",
                scope: "superuser",
                username: "inserted",
            };

            const OUTPUT = await UserServices.insert(INPUT);
            compareUserNew(OUTPUT, INPUT);

            const FOUND = await UserServices.find(OUTPUT.id);
            compareUserOld(FOUND, OUTPUT);

        });

    });

    describe("UserServices.lists()", () => {

        it("should see an association when it is present", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_THIRD_REGULAR);

            const LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(1);
            expect(LISTS[0].name).to.include(USER.firstName);

        });

        it("should see no associations when none are present", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);

            const OUTPUTS = await UserServices.lists(USER.id);
            expect(OUTPUTS.length).to.equal(0);

        });

    });

    describe("UserServices.listsExclude()", () => {

        it("should see an excluded association go away", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN);
            let LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(1);

            await UserServices.listsExclude(USER.id, LISTS[0].id);
            LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(0);

        });


    });

    describe("UserServices.listsInclude()", () => {

        it("should see List after inclusion (admin=false)", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            let LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(0);

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            await UserServices.listsInclude(USER.id, LIST.id, false);
            LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(1);
            expect(LISTS[0].UserList).to.exist;
            expect(LISTS[0].id).to.equal(LIST.id);
            // @ts-ignore
            expect(LISTS[0].UserList.admin).to.be.false;

        });

        it("should see List after inclusion (admin=true)", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            let LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(0);

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            await UserServices.listsInclude(USER.id, LIST.id, true);
            LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(1);
            expect(LISTS[0].UserList).to.exist;
            expect(LISTS[0].id).to.equal(LIST.id);
            // @ts-ignore
            expect(LISTS[0].UserList.admin).to.be.true;

        });

        it("should see List after inclusion (admin=undefined)", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            let LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(0);

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            await UserServices.listsInclude(USER.id, LIST.id);
            LISTS = await UserServices.lists(USER.id);
            expect(LISTS.length).to.equal(1);
            expect(LISTS[0].UserList).to.exist;
            expect(LISTS[0].id).to.equal(LIST.id);
            // @ts-ignore
            expect(LISTS[0].UserList.admin).to.be.true;

        });

    });

    describe("UserServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            try {
                await UserServices.remove(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`userId: Missing User ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid input", async () => {

            const INPUT = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            const OUTPUT = await UserServices.remove(INPUT.id);
            expect(OUTPUT.id).to.equal(INPUT.id);

            try {
                await UserServices.remove(INPUT.id);
                expect.fail(`Should have thrown NotFound after remove`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`userId: Missing User ${INPUT.id}`);
                } else {
                    expect.fail(`Should have thrown NotFound`);
                }
            }

        });

    });

    describe("UserServices.update()", () => {

        it("should fail on duplicate username", async () => {

            const ORIGINAL = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            const INPUT = {
                active: ORIGINAL.active,
                firstName: ORIGINAL.firstName,
                lastName: ORIGINAL.lastName,
                scope: ORIGINAL.scope,
                username: SeedData.USER_USERNAME_FIRST_ADMIN,
            }

            try {
                await UserServices.update(ORIGINAL.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include
                    (`username: Username '${INPUT.username}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid ID", async () => {

            const ORIGINAL = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            const INPUT = {
                active: ORIGINAL.active,
                firstName: ORIGINAL.firstName,
            }

            try {
                await UserServices.update(INVALID_ID, INPUT);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`userId: Missing User ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on on changes data", async () => {

            const INPUT = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_REGULAR);

            const OUTPUT = await UserServices.update(INPUT.id, INPUT);
            compareUserOld(OUTPUT, INPUT);

        });

        it("should pass on no updates data", async () => {

            const ORIGINAL = await UTILS.lookupUser(SeedData.USER_USERNAME_SECOND_REGULAR);
            const INPUT: Partial<User> = {};

            const OUTPUT = await UserServices.update(ORIGINAL.id, INPUT);
            compareUserOld(OUTPUT, INPUT);
            const UPDATED = await UserServices.find(ORIGINAL.id);
            compareUserOld(UPDATED, OUTPUT);

        });

        it("should pass on valid updates data", async () => {

            const ORIGINAL = await UTILS.lookupUser(SeedData.USER_USERNAME_SECOND_ADMIN);
            const INPUT = {
                active: !ORIGINAL.active,
                scope: ORIGINAL.scope + " extra",
            }

            const OUTPUT = await UserServices.update(ORIGINAL.id, INPUT);
            compareUserOld(OUTPUT, INPUT);
            const UPDATED = await UserServices.find(ORIGINAL.id); // Pick up password redact
            compareUserOld(UPDATED, OUTPUT);

        });

    });

});

// Helper Objects ------------------------------------------------------------

export function compareUserNew(OUTPUT: Partial<User>, INPUT: Partial<User>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.firstName).to.equal(INPUT.firstName);
    expect(OUTPUT.lastName).to.equal(INPUT.lastName);
    expect(OUTPUT.password).to.equal(""); // Redacted
    expect(OUTPUT.scope).to.equal(INPUT.scope);
    expect(OUTPUT.username).to.equal(INPUT.username);
}

export function compareUserOld(OUTPUT: Partial<User>, INPUT: Partial<User>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : OUTPUT.active);
    expect(OUTPUT.firstName).to.equal(INPUT.firstName ? INPUT.firstName : OUTPUT.firstName);
    expect(OUTPUT.lastName).to.equal(INPUT.lastName ? INPUT.lastName : OUTPUT.lastName);
    expect(OUTPUT.password).to.equal(""); // Redacted
    expect(OUTPUT.scope).to.equal(INPUT.scope ? INPUT.scope : OUTPUT.scope);
}

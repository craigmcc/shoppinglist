// ListServices.test ---------------------------------------------------------

// Functional tests for ListServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import ListServices from "./ListServices";
import List from "../models/List";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();
const INVALID_ID = UTILS.invalidId();

// Test Specifications -------------------------------------------------------

describe("ListServices Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withLists: true,
            withUsers: true,
        });
    })

    // Test Methods ----------------------------------------------------------

    describe("ListServices.all()", () => {

        it("should pass on active Lists", async () => {

            const lists = await ListServices.all({ active: "" });
            lists.forEach(list => {
                expect(list.active).to.be.true;
            });

        });

        it("should pass on all Lists", async () => {

            const lists = await ListServices.all();
            expect(lists.length).to.equal(SeedData.LISTS.length);

        });

        it("should pass on named Lists", async () => {

            const PATTERN = "EcO";  // Should match on "Second"

            const lists = await ListServices.all({ name: PATTERN });
            expect(lists.length).to.be.greaterThan(0);
            expect(lists.length).to.be.lessThan(SeedData.LISTS.length);
            lists.forEach(list => {
                expect(list.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            });

        });

        it("should pass on paginated Lists", async () => {

            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await ListServices.all();

            const OUTPUTS = await ListServices.all({
                limit: LIMIT,
                offset: OFFSET,
            });
            expect(OUTPUTS.length).to.be.lessThanOrEqual(LIMIT);
            expect(OUTPUTS.length).to.equal(SeedData.LISTS.length - OFFSET);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareListOld(OUTPUT, INPUTS[index + OFFSET]);
            });

        });

    });

    describe("ListServices.find()", () => {

        it("should fail on invalid ID", async () => {

            try {
                await ListServices.find(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`listId: Missing List ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid IDs", async () => {

            const INPUTS = await ListServices.all();

            INPUTS.forEach(async (INPUT) => {
                const OUTPUT = await ListServices.find(INPUT.id);
                expect(OUTPUT.id).to.equal(INPUT.id);
            });

        });

    });

    describe("ListServices.insert()", () => {

        it("should fail on invalid input data", async () => {

            const INPUT = {};

            try {
                await ListServices.insert(INPUT);
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
                name: "Inserted List",
                theme: "tangerine",
            };

            const OUTPUT = await ListServices.insert(INPUT);
            compareListNew(OUTPUT, INPUT);

            const FOUND = await ListServices.find(OUTPUT.id);
            compareListOld(FOUND, OUTPUT);

        });

    });

    describe("ListServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            try {
                await ListServices.remove(INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`listId: Missing List ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid input", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const OUTPUT = await ListServices.remove(INPUT.id);
            expect(OUTPUT.id).to.equal(INPUT.id);

            try {
                await ListServices.remove(INPUT.id);
                expect.fail(`Should have thrown NotFound after remove`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`listId: Missing List ${INPUT.id}`);
                } else {
                    expect.fail(`Should have thrown NotFound`);
                }
            }

        });

    });

    describe("ListServices.update()", () => {

        it("should fail on invalid ID", async () => {

            const ORIGINAL = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUT = {
                active: ORIGINAL.active,
                name: ORIGINAL.name,
            }

            try {
                await ListServices.update(INVALID_ID, INPUT);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`listId: Missing List ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on on changes data", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);

            const OUTPUT = await ListServices.update(INPUT.id, INPUT);
            compareListOld(OUTPUT, INPUT);

        });

        it("should pass on no updates data", async () => {

            const ORIGINAL = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUT: Partial<List> = {};

            const OUTPUT = await ListServices.update(ORIGINAL.id, INPUT);
            compareListOld(OUTPUT, INPUT);
            const UPDATED = await ListServices.find(ORIGINAL.id);
            compareListOld(UPDATED, OUTPUT);

        });

        it("should pass on valid updates data", async () => {

            const ORIGINAL = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUT = {
                active: !ORIGINAL.active,
                name: ORIGINAL.name + " Updated",
            }

            const OUTPUT = await ListServices.update(ORIGINAL.id, INPUT);
            compareListOld(OUTPUT, INPUT);
            const UPDATED = await ListServices.find(ORIGINAL.id);
            compareListOld(UPDATED, OUTPUT);

        });

    });

    describe("ListServices.users()", () => {

        it("should see an association when it is present", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(2);
            USERS.forEach(USER => {
                expect(USER.firstName).to.equal("First");
            });

        });

        it("should see no associations when none are present", async () => {

            const INPUT: Partial<List> = {
                name: "Fourth List",
            }
            // @ts-ignore
            const LIST = await List.create(INPUT);

            const OUTPUTS = await ListServices.users(LIST.id);
            expect(OUTPUTS.length).to.equal(0);

        });

    });

    describe("ListServices.usersExclude()", () => {

        it("should see an excluded association go away", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(2);

            await ListServices.usersExclude(LIST.id, USERS[0].id);
            await ListServices.usersExclude(LIST.id, USERS[1].id);
            const OUTPUTS = await ListServices.users(LIST.id);
            expect(OUTPUTS.length).to.equal(0);

        });

    });

    describe("ListServices.usersInclude()", () => {

        it("should see User after inclusion (admin=false)", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            let USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(2);

            const SUPERUSER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            await ListServices.usersInclude(LIST.id, SUPERUSER.id, false);
            USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(3);
            USERS.forEach(USER => {
                if (USER.username === SeedData.USER_USERNAME_SUPERUSER) {
                    expect(USER.UserList).to.exist;
                    // @ts-ignore
                    expect(USER.UserList.admin).to.be.false;
                }
            })

        });

        it("should see User after inclusion (admin=true)", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            let USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(2);

            const SUPERUSER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            await ListServices.usersInclude(LIST.id, SUPERUSER.id, true);
            USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(3);
            USERS.forEach(USER => {
                if (USER.username === SeedData.USER_USERNAME_SUPERUSER) {
                    expect(USER.UserList).to.exist;
                    // @ts-ignore
                    expect(USER.UserList.admin).to.be.true;
                }
            })

        });

        it("should see User after inclusion (admin=undefined)", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            let USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(2);

            const SUPERUSER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            await ListServices.usersInclude(LIST.id, SUPERUSER.id);
            USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(3);
            USERS.forEach(USER => {
                if (USER.username === SeedData.USER_USERNAME_SUPERUSER) {
                    expect(USER.UserList).to.exist;
                    // @ts-ignore
                    expect(USER.UserList.admin).to.be.true;
                }
            })

        });

    });

});

// Helper Objects ------------------------------------------------------------

export function compareListNew(OUTPUT: Partial<List>, INPUT: Partial<List>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.theme).to.equal(INPUT.theme ? INPUT.theme : null);
}

export function compareListOld(OUTPUT: Partial<List>, INPUT: Partial<List>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.theme).to.equal(INPUT.theme ? INPUT.theme : OUTPUT.theme);
}

// ListServices.special.test -------------------------------------------------

// Functional tests for ListServices that require special seed data loading.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import ItemServices from "./ItemServices";
import ListServices from "./ListServices";
import UserServices from "./UserServices";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {InitialListData} from "../util/InitialListData";
import {NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();
const INVALID_ID = UTILS.invalidId();

// Test Specifications -------------------------------------------------------

describe("ListServices Special Tests", () => {

    // Test Methods ----------------------------------------------------------

    describe("ListServices.categories()", () => {

        beforeEach("categories#beforeEach", async () => {
            await UTILS.loadData({
                withCategories: true,
                withItems: true,
                withLists: true,
                withUsers: true,
            });
        });

        it("should pass on active categories", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const CATEGORIES = await ListServices.categories(LIST.id,
                { active: "" });
            expect(CATEGORIES.length).to.be.lessThan(SeedData.CATEGORIES.length);
            CATEGORIES.forEach(CATEGORY => {
                expect(CATEGORY.active).to.be.true;
                expect(CATEGORY.listId).to.equal(LIST.id);
            });

        });

        it("should pass on all categories", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const CATEGORIES = await ListServices.categories(LIST.id);
            expect(CATEGORIES.length).to.equal(SeedData.CATEGORIES.length);
            CATEGORIES.forEach(CATEGORY => {
                expect(CATEGORY.listId).to.equal(LIST.id);
            });

        });

        it("should pass on named categories", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const PATTERN = "iR"; // Should match "First" and "Third"

            const CATEGORIES = await ListServices.categories(LIST.id,
                { name: PATTERN });
            expect(CATEGORIES.length).to.be.lessThan(SeedData.CATEGORIES.length);
            CATEGORIES.forEach(CATEGORY => {
                expect(CATEGORY.listId).to.equal(LIST.id);
                expect(CATEGORY.name.toLowerCase()).includes(PATTERN.toLowerCase());
            });

        });

        it("should pass with included objects", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const CATEGORIES = await ListServices.categories(LIST.id,
                { withItems: "", withList: "" });
            expect(CATEGORIES.length).to.equal(SeedData.CATEGORIES.length);
            CATEGORIES.forEach(CATEGORY => {
                expect(CATEGORY.items).to.exist;
                expect(CATEGORY.items.length).to.equal(SeedData.ITEMS.length);
                CATEGORY.items.forEach(ITEM => {
                    expect(ITEM.categoryId).equal(CATEGORY.id);
                });
                expect(CATEGORY.list).to.exist;
                expect(CATEGORY.list.id).equals(LIST.id);
            });

        });

        it("should pass on all items", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const ITEMS = await ListServices.categories(LIST.id);
            expect(ITEMS.length).to.equal(SeedData.ITEMS.length);
            ITEMS.forEach(ITEM => {
                expect(ITEM.listId).to.equal(LIST.id);
            });

        });

    });

    describe("ListServices.clear()", () => {

        beforeEach("clear#beforeEach", async () => {
            await UTILS.loadData({
                withCategories: true,
                withItems: true,
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail on an invalid List ID", async () => {

            try {
                await ListServices.clear(INVALID_ID);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include
                    (`listId: Missing List ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid List ID", async () => {

            const INPUT = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUT_ITEMS = await ListServices.items(INPUT.id);
            INPUT_ITEMS.forEach(async ITEM => {
                if (ITEM.active) {
                    ITEM.checked = true;
                    ITEM.selected = true;
                    await ItemServices.update(INPUT.id, ITEM.id, ITEM);
                }
            });

            const OUTPUT = await ListServices.clear(INPUT.id);
            const OUTPUT_ITEMS = await ListServices.items(OUTPUT.id);
            OUTPUT_ITEMS.forEach(ITEM => {
                expect(ITEM.checked).to.be.false;
                expect(ITEM.selected).to.be.false;
            });

        });

    });

    describe("ListServices.items()", () => {

        beforeEach("items#beforeEach", async () => {
            await UTILS.loadData({
                withCategories: true,
                withItems: true,
                withLists: true,
                withUsers: true,
            });
        });

        it("should pass on active items", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            const ITEMS = await ListServices.items(LIST.id,
                { active: "" });
            expect(ITEMS.length).to.be.lessThan(SeedData.ITEMS.length);
            ITEMS.forEach(ITEM => {
                expect(ITEM.active).to.be.true;
                expect(ITEM.listId).to.equal(LIST.id);
            });

        });

        it("should pass on all items", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            const ITEMS = await ListServices.items(LIST.id);
            expect(ITEMS.length).to.equal(SeedData.ITEMS.length);
            ITEMS.forEach(ITEM => {
                expect(ITEM.listId).to.equal(LIST.id);
            });

        });

    });

    describe("ListServices.populate()", () => {

        beforeEach("populate#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("will pass if no conflicting names are present", async () => {

            const INPUT = await ListServices.insert({
                name: "Brand New List"
            });

            const OUTPUT = await ListServices.populate(INPUT.id);
            expect(OUTPUT.categories).to.exist;
            expect(OUTPUT.items).to.exist;
            expect(OUTPUT.categories.length).to.equal(InitialListData.length);

        });

    });

    describe("ListServices.users()", () => {

        beforeEach("users#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail for invalid listId", async () => {

            try {
                await ListServices.users(INVALID_ID);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`Missing List ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        })

        it("should pass for valid listId", async () => {

            const LISTS = await ListServices.all();

            LISTS.forEach(async LIST => {
                const USERS = await ListServices.users(LIST.id);
                expect(USERS.length).to.equal(2); // Regular and Admin users
            });

        })

    });

    describe("ListServices.usersExclude()", () => {

        beforeEach("usersExclude#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail on invalid listId", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_FIRST_ADMIN);

            try {
                await ListServices.usersExclude(INVALID_ID, USER.id);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`Missing List ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid userId", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            try {
                await ListServices.usersExclude(LIST.id, INVALID_ID);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`Missing User ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid listId and userId", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const USERS = await ListServices.users(LIST.id);
            expect(USERS.length).to.equal(2);

            await ListServices.usersExclude(LIST.id, USERS[0].id);
            const OUTPUTS = await ListServices.users(LIST.id);
            expect(OUTPUTS.length).to.equal(1);
            // Make sure the actual User did not get deleted, just the link
            await UserServices.find(USERS[0].id);

        });

    });

    describe("ListServices.usersInclude()", () => {

        beforeEach("usersInclude#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        });

        it("should fail on invalid listId", async () => {

            const USER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);

            try {
                await ListServices.usersInclude(INVALID_ID, USER.id);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`Missing List ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on invalid userId", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);

            try {
                await ListServices.usersInclude(LIST.id, INVALID_ID);
                expect.fail(`Should have thrown NotFound`);
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`Missing User ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid listId and userId", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const SUPERUSER = await UTILS.lookupUser(SeedData.USER_USERNAME_SUPERUSER);
            const USERS1 = await ListServices.users(LIST.id);

            expect(USERS1.length).to.equal(2);
            await ListServices.usersInclude(LIST.id, SUPERUSER.id);
            const USERS2 = await ListServices.users(LIST.id);
            expect(USERS2.length).to.equal(3);

        });

    });

});

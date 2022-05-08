// ItemServices.test ---------------------------------------------------------

// Functional tests for ItemServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import ItemServices from "./ItemServices";
import Item from "../models/Item";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();
const INVALID_ID = UTILS.invalidId();

// Test Specifications -------------------------------------------------------

describe("ItemServices Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withCategories: true,
            withLists: true,
            withItems: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("ItemServices.all()", () => {

        it("should pass on active Items", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const ITEMS = await ItemServices.all(LIST.id, {
                active: "",
            });

            expect(ITEMS.length).to.be.lessThanOrEqual(SeedData.ITEMS.length);
            ITEMS.forEach(ITEM => {
                expect(ITEM.active).to.be.true;
                expect(ITEM.listId).to.equal(LIST.id);
            });

        });

        it("should pass on all Items", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const ITEMS = await ItemServices.all(LIST.id);

            expect(ITEMS.length).to.equal(SeedData.ITEMS.length);
            ITEMS.forEach(ITEM => {
                expect(ITEM.listId).to.equal(LIST.id);
            });

        });

        it("should pass on included parents", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            // NOTE - lookupList returns the first list that matches by name, which is not unique
            const ITEMS = await ItemServices.all(LIST.id, {
                withCategory: "",
                withList: "",
            });

            expect(ITEMS.length).to.equal(SeedData.ITEMS.length);
            ITEMS.forEach(ITEM => {
                expect(ITEM.category).to.exist;
                expect(ITEM.category.listId).to.equal(LIST.id);
                expect(ITEM.list).to.exist;
                expect(ITEM.list.id).to.equal(LIST.id);
            });

        });

        it("should pass on named Items", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const PATTERN = "Ir"; // Should match "Third";
            const INPUTS = await ItemServices.all(LIST.id, { name: PATTERN });

            expect(INPUTS.length).to.be.greaterThan(0);
            INPUTS.forEach(INPUT => {
                expect(INPUT.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            });

        });

        it("should pass on paginated Items", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await ItemServices.all(LIST.id);
            const OUTPUTS = await ItemServices.all(LIST.id, {
                limit: LIMIT,
                offset: OFFSET,
            });

            expect(OUTPUTS.length).to.be.lessThanOrEqual(LIMIT);
            expect(OUTPUTS.length).to.equal(SeedData.ITEMS.length - OFFSET);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareItemOld(OUTPUT, INPUTS[index + OFFSET]);
            });

        });


    });

    describe("ItemServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INVALID_NAME = "Invalid Item Name";

            try {
                await ItemServices.exact(LIST.id, INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`name: Missing Item '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on included parents", async () => {

            const LIST= await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUTS = await ItemServices.all(LIST.id);

            INPUTS.forEach(async INPUT => {
                const name = INPUT.name ? INPUT.name : "foo";
                const result = await ItemServices.exact(LIST.id, name, {
                    withCategory: "",
                    withList: "",
                });
                expect(result.category).to.exist;
                expect(result.category.listId).to.equal(LIST.id);
                expect(result.list).to.exist;
                expect(result.list.id).to.equal(LIST.id);
            });

        });

        it("should pass on valid names", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const INPUTS = await ItemServices.all(LIST.id);

            INPUTS.forEach(async INPUT => {
                const name = INPUT.name ? INPUT.name : "foo";
                const result = await ItemServices.exact(LIST.id, name);
                expect(result.name).to.equal(INPUT.name);
            });

        });

    });

    describe("ItemServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            try {
                await ItemServices.find(LIST.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`itemId: Missing Item ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on included parents", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUTS = await ItemServices.all(LIST.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await ItemServices.find(LIST.id, INPUT.id, {
                    withCategory: "",
                    withList: "",
                });
                expect(OUTPUT.category).to.exist;
                expect(OUTPUT.category.listId).to.equal(LIST.id);
                expect(OUTPUT.list).to.exist;
                expect(OUTPUT.list.id).to.equal(LIST.id);
            });

        });

        it("should pass on valid IDs", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const INPUTS = await ItemServices.all(LIST.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await ItemServices.find(LIST.id, INPUT.id);
                compareItemOld(OUTPUT, INPUT);
            });

        });

    });

    describe("ItemServices.insert()", () => {

        it("should fail on duplicate data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUTS = await ItemServices.all(LIST.id);
            const INPUT = {
                name: INPUTS[0].name,
            };

            try {
                await ItemServices.insert(LIST.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include(`name: Name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should fail on missing data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUT = {};

            try {
                await ItemServices.insert(LIST.id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include("name: Is required");
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const CATEGORY = await UTILS.lookupCategory(LIST, SeedData.CATEGORY_NAME_FIRST);
            const INPUT = {
                active: false,
                categoryId: CATEGORY.id,
                name: "Valid Name",
                notes: "This is a note",
            }

            const OUTPUT = await ItemServices.insert(LIST.id, INPUT);
            compareItemNew(OUTPUT, INPUT);

        });

    });

    describe("ItemServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            try {
                await ItemServices.remove(LIST.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`itemId: Missing Item ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid ID", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const ITEMS = await ItemServices.all(LIST.id);
            const VALID_ID = ITEMS[0].id;

            const OUTPUT = await ItemServices.remove(LIST.id, VALID_ID);
            expect(OUTPUT.id).to.equal(VALID_ID);

            try {
                await ItemServices.remove(LIST.id, VALID_ID);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`itemId: Missing Item ${VALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

    });

    describe("ItemServices.update()", () => {

        it("should fail on duplicate data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const ITEMS = await ItemServices.all(LIST.id);
            const INPUT = {
                name: ITEMS[0].name,
            }

            try {
                await ItemServices.update(LIST.id, ITEMS[1].id, INPUT);
                expect.fail("Should have thrown BadRequest");
            } catch (error) {
                if (error instanceof BadRequest) {
                    expect(error.message).to.include(`name: Name '${INPUT.name}' is already in use`);
                } else {
                    expect.fail(`Should not have thrown ${error}'`);
                }
            }

        });

        it("should fail on invalid ID", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUT = {};

            try {
                await ItemServices.update(LIST.id, INVALID_ID, INPUT);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`itemId: Missing Item ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on no changes data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const ITEMS = await ItemServices.all(LIST.id);
            const INPUT = ITEMS[0];

            const OUTPUT = await ItemServices.update(LIST.id, INPUT.id, INPUT);
            compareItemOld(OUTPUT, INPUT);
            const UPDATED = await ItemServices.find(LIST.id, INPUT.id);
            compareItemOld(UPDATED, OUTPUT);

        });

        it("should pass on no updates data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const ITEMS = await ItemServices.all(LIST.id);
            const INPUT = { };
            const VALID_ID = ITEMS[0].id;

            const OUTPUT = await ItemServices.update(LIST.id, VALID_ID, INPUT);
            compareItemOld(OUTPUT, INPUT);
            const UPDATED = await ItemServices.find(LIST.id, VALID_ID);
            compareItemOld(UPDATED, OUTPUT);

        });

        it("should pass on valid updates data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const ITEMS = await ItemServices.all(LIST.id);
            const INPUT = {
                name: "New Name",
                notes: "New Notes",
                theme: "orange",
            }
            const VALID_ID = ITEMS[0].id;

            const OUTPUT = await ItemServices.update(LIST.id, VALID_ID, INPUT);
            compareItemOld(OUTPUT, INPUT);
            const UPDATED = await ItemServices.find(LIST.id, VALID_ID);
            compareItemOld(UPDATED, OUTPUT);

        });

    });

});

// Helper Objects ------------------------------------------------------------

export function compareItemNew(OUTPUT: Partial<Item>, INPUT: Partial<Item>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.categoryId).to.equal(INPUT.categoryId ? INPUT.categoryId : OUTPUT.categoryId);
    expect(OUTPUT.checked).to.equal(INPUT.checked !== undefined ? INPUT.checked : false);
    expect(OUTPUT.listId).to.equal(INPUT.listId ? INPUT.listId : OUTPUT.listId);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.selected).to.equal(INPUT.selected !== undefined ? INPUT.selected : false);
    expect(OUTPUT.theme).to.equal(INPUT.theme ? INPUT.theme : null);
}

export function compareItemOld(OUTPUT: Partial<Item>, INPUT: Partial<Item>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.categoryId).to.equal(INPUT.categoryId ? INPUT.categoryId : OUTPUT.categoryId);
    expect(OUTPUT.checked).to.equal(INPUT.checked ? INPUT.checked : OUTPUT.checked);
    expect(OUTPUT.listId).to.equal(INPUT.listId ? INPUT.listId : OUTPUT.listId);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.selected).to.equal(INPUT.selected ? INPUT.selected : OUTPUT.selected);
    expect(OUTPUT.theme).to.equal(INPUT.theme ? INPUT.theme : OUTPUT.theme);
}

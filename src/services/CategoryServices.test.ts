// CategoryServices.test -----------------------------------------------------

// Functional tests for CategoryServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import CategoryServices from "./CategoryServices";
import Category from "../models/Category";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";

const UTILS = new ServicesUtils();
const INVALID_ID = UTILS.invalidId();

// Test Specifications -------------------------------------------------------

describe("CategoryServices Functional Tests", () => {

    // Test Hooks ------------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await UTILS.loadData({
            withLists: true,
            withCategories: true,
        });
    });

    // Test Methods ----------------------------------------------------------

    describe("CategoryServices.all()", () => {

        it("should pass on active Categories", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const CATEGORIES = await CategoryServices.all(LIST.id, {
                active: "",
            });

            expect(CATEGORIES.length).to.be.lessThanOrEqual(SeedData.CATEGORIES.length);
            CATEGORIES.forEach(CATEGORY => {
                expect(CATEGORY.active).to.be.true;
                expect(CATEGORY.listId).to.equal(LIST.id);
            });

        });

        it("should pass on all Categories", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const CATEGORIES = await CategoryServices.all(LIST.id);

            expect(CATEGORIES.length).to.equal(SeedData.CATEGORIES.length);
            CATEGORIES.forEach(CATEGORY => {
                expect(CATEGORY.listId).to.equal(LIST.id);
            });

        });

        it("should pass on included parent", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const CATEGORIES = await CategoryServices.all(LIST.id, {
                withList: "",
            });

            expect(CATEGORIES.length).to.equal(SeedData.CATEGORIES.length);
            CATEGORIES.forEach(CATEGORY => {
                expect(CATEGORY.list).to.exist;
                expect(CATEGORY.list.id).to.equal(LIST.id);
            });

        });

        it("should pass on named Categories", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const PATTERN = "Ir"; // Should match "Third";
            const INPUTS = await CategoryServices.all(LIST.id, { name: PATTERN });

            expect(INPUTS.length).to.be.greaterThan(0);
            INPUTS.forEach(INPUT => {
                expect(INPUT.name.toLowerCase()).to.include(PATTERN.toLowerCase());
            });

        });

        it("should pass on paginated Categories", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const LIMIT = 99;
            const OFFSET = 1;
            const INPUTS = await CategoryServices.all(LIST.id);
            const OUTPUTS = await CategoryServices.all(LIST.id, {
                limit: LIMIT,
                offset: OFFSET,
            });

            expect(OUTPUTS.length).to.be.lessThanOrEqual(LIMIT);
            expect(OUTPUTS.length).to.equal(SeedData.CATEGORIES.length - OFFSET);
            OUTPUTS.forEach((OUTPUT, index) => {
                compareCategoryOld(OUTPUT, INPUTS[index + OFFSET]);
            });

        });


    });

    describe("CategoryServices.exact()", () => {

        it("should fail on invalid name", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INVALID_NAME = "Invalid Category Name";

            try {
                await CategoryServices.exact(LIST.id, INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes(`name: Missing Category '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on included parent", async () => {

            const LIST= await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUTS = await CategoryServices.all(LIST.id);

            INPUTS.forEach(async INPUT => {
                const name = INPUT.name ? INPUT.name : "foo";
                const result = await CategoryServices.exact(LIST.id, name, {
                    withList: "",
                });
                expect(result.list).to.exist;
                expect(result.list.id).to.equal(LIST.id);
            });

        });

        it("should pass on valid names", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const INPUTS = await CategoryServices.all(LIST.id);

            INPUTS.forEach(async INPUT => {
                const name = INPUT.name ? INPUT.name : "foo";
                const result = await CategoryServices.exact(LIST.id, name);
                expect(result.name).to.equal(INPUT.name);
            });

        });

    });

    describe("CategoryServices.find()", () => {

        it("should fail on invalid ID", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            try {
                await CategoryServices.find(LIST.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`categoryId: Missing Category ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on included parent", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const INPUTS = await CategoryServices.all(LIST.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await CategoryServices.find(LIST.id, INPUT.id, {
                    withList: "",
                });
                expect(OUTPUT.list).to.exist;
                expect(OUTPUT.list.id).to.equal(LIST.id);
            });

        });

        it("should pass on valid IDs", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const INPUTS = await CategoryServices.all(LIST.id);

            INPUTS.forEach(async INPUT => {
                const OUTPUT = await CategoryServices.find(LIST.id, INPUT.id);
                compareCategoryOld(OUTPUT, INPUT);
            });

        });

    });

    describe("CategoryServices.insert()", () => {

        it("should fail on duplicate data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const INPUTS = await CategoryServices.all(LIST.id);
            const INPUT = {
                name: INPUTS[0].name,
            };

            try {
                await CategoryServices.insert(LIST.id, INPUT);
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
                await CategoryServices.insert(LIST.id, INPUT);
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
            const INPUT = {
                active: false,
                name: "Valid Name",
                notes: "This is a note",
            }

            const OUTPUT = await CategoryServices.insert(LIST.id, INPUT);
            compareCategoryNew(OUTPUT, INPUT);

        });

    });

    describe("CategoryServices.remove()", () => {

        it("should fail on invalid ID", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);

            try {
                await CategoryServices.remove(LIST.id, INVALID_ID);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`categoryId: Missing Category ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on valid ID", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const CATEGORIES = await CategoryServices.all(LIST.id);
            const VALID_ID = CATEGORIES[0].id;

            const OUTPUT = await CategoryServices.remove(LIST.id, VALID_ID);
            expect(OUTPUT.id).to.equal(VALID_ID);

            try {
                await CategoryServices.remove(LIST.id, VALID_ID);
                expect.fail("Should have thrown NotFound after remove");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`categoryId: Missing Category ${VALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

    });

    describe("CategoryServices.update()", () => {

        it("should fail on duplicate data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const CATEGORIES = await CategoryServices.all(LIST.id);
            const INPUT = {
                listId: LIST.id,
                name: CATEGORIES[0].name,
            }

            try {
                await CategoryServices.update(LIST.id, CATEGORIES[1].id, INPUT);
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
                await CategoryServices.update(LIST.id, INVALID_ID, INPUT);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).to.include(`categoryId: Missing Category ${INVALID_ID}`);
                } else {
                    expect.fail(`Should not have thrown '${error}'`);
                }
            }

        });

        it("should pass on no changes data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_THIRD);
            const CATEGORIES = await CategoryServices.all(LIST.id);
            const INPUT = CATEGORIES[0];

            const OUTPUT = await CategoryServices.update(LIST.id, INPUT.id, INPUT);
            compareCategoryOld(OUTPUT, INPUT);
            const UPDATED = await CategoryServices.find(LIST.id, INPUT.id);
            compareCategoryOld(UPDATED, OUTPUT);

        });

        it("should pass on no updates data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_FIRST);
            const CATEGORIES = await CategoryServices.all(LIST.id);
            const INPUT = { };
            const VALID_ID = CATEGORIES[0].id;

            const OUTPUT = await CategoryServices.update(LIST.id, VALID_ID, INPUT);
            compareCategoryOld(OUTPUT, INPUT);
            const UPDATED = await CategoryServices.find(LIST.id, VALID_ID);
            compareCategoryOld(UPDATED, OUTPUT);

        });

        it("should pass on valid updates data", async () => {

            const LIST = await UTILS.lookupList(SeedData.LIST_NAME_SECOND);
            const CATEGORIES = await CategoryServices.all(LIST.id);
            const INPUT = {
                name: "New Name",
                notes: "New Notes",
                theme: "orange",
            }
            const VALID_ID = CATEGORIES[0].id;

            const OUTPUT = await CategoryServices.update(LIST.id, VALID_ID, INPUT);
            compareCategoryOld(OUTPUT, INPUT);
            const UPDATED = await CategoryServices.find(LIST.id, VALID_ID);
            compareCategoryOld(UPDATED, OUTPUT);

        });

    });

});

// Helper Objects ------------------------------------------------------------

export function compareCategoryNew(OUTPUT: Partial<Category>, INPUT: Partial<Category>) {
    expect(OUTPUT.id).to.exist;
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.listId).to.equal(INPUT.listId ? INPUT.listId : OUTPUT.listId);
    expect(OUTPUT.name).to.equal(INPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : null);
    expect(OUTPUT.theme).to.equal(INPUT.theme ? INPUT.theme : null);
}

export function compareCategoryOld(OUTPUT: Partial<Category>, INPUT: Partial<Category>) {
    expect(OUTPUT.id).to.equal(INPUT.id ? INPUT.id : OUTPUT.id);
    expect(OUTPUT.active).to.equal(INPUT.active !== undefined ? INPUT.active : true);
    expect(OUTPUT.listId).to.equal(INPUT.listId ? INPUT.listId : OUTPUT.listId);
    expect(OUTPUT.name).to.equal(INPUT.name ? INPUT.name : OUTPUT.name);
    expect(OUTPUT.notes).to.equal(INPUT.notes ? INPUT.notes : OUTPUT.notes);
    expect(OUTPUT.theme).to.equal(INPUT.theme ? INPUT.theme : OUTPUT.theme);
}

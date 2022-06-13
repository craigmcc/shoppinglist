// ListServices.special.test -------------------------------------------------

// Functional tests for ListServices that require special seed data loading.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import UserServices from "./UserServices";
import CreateAccount from "../models/CreateAccount";
import {TEST_MODE_TOKEN} from "./CaptchaServices";
import * as SeedData from "../test/SeedData";
import ServicesUtils from "../test/ServicesUtils";

const UTILS = new ServicesUtils();

// Test Specifications -------------------------------------------------------

describe ("UserServices Special Tests", () => {

    // Test Methods ----------------------------------------------------------

    // TODO - will need to be revised when ReCAPTCHA is implemented
    // TODO - will need to be revised if populate option is passed in
    describe("UserServices.create()", () => {

        beforeEach("create#beforeEach", async () => {
            await UTILS.loadData({
                withLists: true,
                withUsers: true,
            });
        })

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

            try {

                const OUTPUT = await UserServices.create(INPUT);
                expect(OUTPUT.active).to.be.true;
                expect(OUTPUT.email).to.equal(INPUT.email);
                expect(OUTPUT.firstName).to.equal(INPUT.firstName);
                expect(OUTPUT.lastName).to.equal(INPUT.lastName);
                expect(OUTPUT.username).to.equal(INPUT.username);

                const LISTS = await UserServices.lists(OUTPUT.id);
                expect(LISTS.length).to.equal(1);
                expect(LISTS[0].name).to.equal(INPUT.listName);
                expect(LISTS[0].UserList).to.exist;
                expect(LISTS[0].UserList?.admin).to.be.true;

            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }

        });

        it("should pass on valid data without list", async () => {

            const INPUT = new CreateAccount({
                email: "newuser@example.com",
                firstName: "New",
                lastName: "User",
                password1: "newpass",
                password2: "newpass",
                token: TEST_MODE_TOKEN,
                username: "newuser",
            });

            try {

                const OUTPUT = await UserServices.create(INPUT);
                expect(OUTPUT.active).to.be.true;
                expect(OUTPUT.email).to.equal(INPUT.email);
                expect(OUTPUT.firstName).to.equal(INPUT.firstName);
                expect(OUTPUT.lastName).to.equal(INPUT.lastName);
                expect(OUTPUT.username).to.equal(INPUT.username);

                const LISTS = await UserServices.lists(OUTPUT.id);
                expect(LISTS.length).to.equal(0);

            } catch (error) {
                expect.fail(`Should not have thrown '${error}'`);
            }

        });

    });

});

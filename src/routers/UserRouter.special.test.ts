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
import User from "../models/User";
import {TEST_MODE_TOKEN} from "../services/CaptchaServices";
import RouterUtils, {AUTHORIZATION} from "../test/RouterUtils";
import * as SeedData from "../test/SeedData";
import {CREATED} from "../util/HttpErrors";

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

});

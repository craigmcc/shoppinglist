// RouterUtils ---------------------------------------------------------------

// Utilities supporting functional tests of {Model}Router objects.

// External Modules ----------------------------------------------------------

const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import ServicesUtils from "./ServicesUtils"
import User from "../models/User";
import app from "../routers/ExpressApplication";
import {OK} from "../util/HttpErrors";

// Public Objects -----------------------------------------------------------

// HTTP header for authorization credentials.
export const AUTHORIZATION = "Authorization";

export class RouterUtils extends ServicesUtils {

    /**
     * Fetch the specified User via an API call, as the specified User
     *
     * @param username                  User name to look up
     * @param asUsername                Username to perform lookup (superuser)
     */
    public async fetchUser(username: string,
                           asUsername = SeedData.USER_USERNAME_SUPERUSER): Promise<User> {
        const PATH = "/api/users/exact/:username";
        const response = await chai.request(app)
            .get(PATH.replace(":username", username))
            .set(AUTHORIZATION, await this.credentials(asUsername));
        expect(response).to.have.status(OK);
        return response.body;
    }

}

export default RouterUtils;

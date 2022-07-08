// MockDatabase --------------------------------------------------------------

// Manage the overall set of mock database services for client side tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockCategoryServices from "./MockCategoryServices";
import MockListServices from "./MockListServices";
import MockUserServices from "./MockUserServices";
import Category from "../../models/Category";
import List from "../../models/List";
import User from "../../models/User";

// Public Objects ------------------------------------------------------------

/**
 * Reset database contents and reload from SeedData.  Calling this ensures that
 * all tests start with exactly the same initial "database" contents.
 */
export const reset = (): void => {

    // Reset model collections
    MockCategoryServices.reset();
    MockListServices.reset();
    MockUserServices.reset();

    // Load seed data in parent-first order
    // TODO

}

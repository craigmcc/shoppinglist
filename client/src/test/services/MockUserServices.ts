// MockUserServices ----------------------------------------------------------

// Client side mocks for UserServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockParentServices from "./MockParentServices";
import User from "../../models/User";
import {NotFound} from "../../util/HttpErrors";

// Public Objects -------------------------------------------------------------

class MockUserServices extends MockParentServices<User> {

    constructor() {
        super(User);
    }

    // Model Specific Methods ------------------------------------------------

    /**
     * Return the User with the specified userame (if any), or throw NotFound.
     *
     * @param username                  Username to be matched
     *
     * @throws NotFound                 If no User with this name is found
     */
    public exact(username: string): User {
        for (const result of this.map.values()) {
            if (result.username === username) {
                // TODO - handle includes
                return result;
            }
        }
        throw new NotFound(
            `username: Missing User '${username}'`,
            `${this.name}Services.exact`,
        );
    }

    // Concrete Helper Methods -----------------------------------------------

    /**
     * Supported include query parameters
     * * withLists                      Include authorized Lists
     *
     * @param model                     Instance being decorated
     * @param query                     Optional query parameters
     */
    public includes(model: User, query?: URLSearchParams): User {
        const result = new User(model);
        if (query) {
            if (query.has("withLists")) {
                // TODO - implement withLists
            }
        }
        return result;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active lists
     *
     * @param model                     Instance being checked
     * @param query                     Optional query parameters
     */
    public matches(model: User, query?: URLSearchParams): boolean {
        let result = true;
        if (query) {
            if (query.has("active") && !model.active) {
                result = false;
            }
        }
        return result;
    }

}

export default new MockUserServices();

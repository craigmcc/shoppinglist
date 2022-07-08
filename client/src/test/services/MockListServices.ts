// MockListServices ----------------------------------------------------------

// Client side mocks for ListServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockParentServices from "./MockParentServices";
import List from "../../models/List";
import {NotFound} from "../../util/HttpErrors";

// Public Objects -------------------------------------------------------------

class MockListServices extends MockParentServices<List> {

    constructor() {
        super(List);
    }

    // Model Specific Methods ------------------------------------------------

    /**
     * Return the List with the specified name (if any), or throw NotFound.
     *
     * @param name                      Name to be matched
     *
     * @throws NotFound                 If no List with this name is found
     */
    public exact(name: string): List {
        for (const result of this.map.values()) {
            if (result.name === name) {
                return this.includes(result);
            }
        }
        throw new NotFound(
            `name: Missing List '${name}'`,
            `${this.name}Services.exact`,
        );
    }

    // Concrete Helper Methods -----------------------------------------------

    /**
     * Supported include query parameters
     * * withCategories                 Include configured Categories
     * * withItems                      Include configured Items
     * * withUsers                      Include authorized Users
     *
     * @param model                     Instance being decorated
     * @param query                     Optional query parameters
     */
    public includes(model: List, query?: URLSearchParams): List {
        const result = new List(model);
        if (query) {
            // TODO - implement withCategories
            // TODO - implement withItems
            // TODO - implement withUsers
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
    public matches(model: List, query?: URLSearchParams): boolean {
        let result = true;
        if (query) {
            if (query.has("active") && !model.active) {
                result = false;
            }
        }
        return result;
    }

}

export default new MockListServices();

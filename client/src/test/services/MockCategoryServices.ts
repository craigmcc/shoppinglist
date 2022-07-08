// MockCategoryServices ------------------------------------------------------

// Client side mocks for CategoryServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockChildServices from "./MockChildServices";
import MockListServices from "./MockListServices";
import Category from "../../models/Category";
import List from "../../models/List";
import {NotFound} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

class MockCategoryServices extends MockChildServices<Category, List> {

    constructor() {
        super(MockListServices, Category);
    }

    // Model Specific Methods ------------------------------------------------

    /**
     * Return the List with the specified name (if any), or throw NotFound.
     *
     * @param listId                    ID of the owning List
     * @param name                      Name to be matched
     *
     * @throws NotFound                 If no List with this name is found
     */
    public exact(listId: string, name: string): Category {
        for (const result of this.map.values()) {
            if (result.listId === listId) {
                if (result.name === name) {
                    return this.includes(result);
                }
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
     * * withItems                      Include associated Items
     * * withList                       Include owning List
     *
     * @param model                     Instance being decorated
     * @param query                     Optional query parameters
     */
    public includes(model: Category, query?: URLSearchParams): Category {
        const result = new Category(model);
        if (query) {
            if (query.has("withItems")) {
                // TODO - implement withItems
            }
            if (query.has("withList")) {
                result.list = MockListServices.find(result.listId);
            }
        }
        return result;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active Categories
     *
     * @param model                     Instance being checked
     * @param query                     Optional query parameters
     */
    public matches(model: Category, query?: URLSearchParams): boolean {
        let result = true;
        if (query) {
            if (query.has("active") && !model.active) {
                result = false;
            }
        }
        return result;
    }

}

export default new MockCategoryServices();

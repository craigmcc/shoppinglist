// MockItemServices ----------------------------------------------------------

// Client side mocks for ItemServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockCategoryServices from "./MockCategoryServices";
import MockChildServices from "./MockChildServices";
import MockListServices from "./MockListServices";
import Item from "../../models/Item";
import List from "../../models/List";
import {NotFound} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

class MockItemServices extends MockChildServices<Item, List> {

    constructor() {
        super(MockListServices, Item);
    }

    // Model Specific Methods ------------------------------------------------

    /**
     * Return the Item with the specified name (if any), or throw NotFound.
     *
     * @param listId                    ID of the owning List
     * @param name                      Name to be matched
     *
     * @throws NotFound                 If no List with this name is found
     */
    public exact(listId: string, name: string): Item {
        for (const result of this.map.values()) {
            if (result.listId === listId) {
                if (result.name === name) {
                    return this.includes(result);
                }
            }
        }
        throw new NotFound(
            `name: Missing Item '${name}'`,
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
    public includes(model: Item, query?: URLSearchParams): Item {
        const result = new Item(model);
        if (query) {
            if (query.has("withCategory")) {
                result.category = MockCategoryServices.read(
                    "MockItemServices.includes",
                    result.listId, result.categoryId);
            }
            if (query.has("withList")) {
                result.list = MockListServices.read(
                    "MockItemServices.includes", result.listId);
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
    public matches(model: Item, query?: URLSearchParams): boolean {
        let result = true;
        if (query) {
            if (query.has("active") && !model.active) {
                result = false;
            }
        }
        return result;
    }

}

export default new MockItemServices();

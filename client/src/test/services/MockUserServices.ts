// MockUserServices ----------------------------------------------------------

// Client side mocks for UserServices operations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockListServices from "./MockListServices";
import MockParentServices from "./MockParentServices";
import User from "../../models/User";
import {NotFound} from "../../util/HttpErrors";
import List from "../../models/List";

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

    /**
     * Return the Lists associated with this User.
     *
     * @param userId                    ID of the User for which to return Lists
     * @param query                     Optional query parameters
     *
     * @throws NotFound                 If no User with this ID is found
     */
    public lists(userId: string, query?: URLSearchParams): List[] {
        // NOTE - we ignore query parameters in tests
        const user = this.read("MockUserServices.lists", userId);
        if (user.lists) {
            return user.lists;
        } else {
            return [];
        }
    }

    /**
     * Exclude the specified List from those associated with this User.
     *
     * @param userId                    ID of the User for which to exclude a List
     * @param listId                    ID of the List to be excluded
     *
     * @throws NotFound                 If no User or List with the specified ID is found
     */
    public listsExclude(userId: string, listId: string): List {
        const user = this.read("MockUserServices.listsExclude", userId);
        const list = MockListServices.read("MockUserServices.listsExclude", listId);
        if (user.lists) {
            const updatedLists = user.lists.filter(list => (list.id !== listId));
            user.lists = updatedLists;
        }
        return list;
    }

    /**
     * Include the specified List with those associated with this User.
     *
     * @param userId                    ID of the User for which to include a List
     * @param listId                    ID of the List to be included
     * @param admin                     Does this User have admin rights on this List?
     *
     * @throws NotFound                 If no User or List with the specified ID is found
     */
    public listsInclude(userId: string, listId: string, admin?: boolean): List {
        // NOTE - we ignore admin status in tests
        const user = this.read("MockUserServices.listsExclude", userId);
        const list = MockListServices.read("MockUserServices.listsExclude", listId);
        if (user.lists) {
            user.lists.push(list);
        } else {
            user.lists = [ list ];
        }
        return list;
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

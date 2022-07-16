// MockDatabase --------------------------------------------------------------

// Manage the overall set of mock database services for client side tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import MockCategoryServices from "./MockCategoryServices";
import MockItemServices from "./MockItemServices";
import MockListServices from "./MockListServices";
import MockUserServices from "./MockUserServices";
import * as SeedData from "../SeedData";
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
    MockItemServices.reset();
    MockListServices.reset();
    MockUserServices.reset();

    // Load seed data in parent-first order
    const users: User[] = [];
    SeedData.USERS.forEach(USER => {
        const user = MockUserServices.insert(new User(USER));
        users.push(user);
    });
    const lists: List[] = [];
    SeedData.LISTS.forEach(LIST => {
        const list = MockListServices.insert(new List(LIST));
        SeedData.CATEGORIES.forEach(CATEGORY => {
            // @ts-ignore
            const category = MockCategoryServices.insert(list.id, {
                ...CATEGORY,
                listId: list.id,
            });
            SeedData.ITEMS.forEach(ITEM => {
                // @ts-ignore
                const item = MockItemServices.insert(list.id, {
                    ...ITEM,
                    categoryId: category.id,
                    listId: list.id,
                });
            });
        })
        lists.push(list);
    });

    // Associate Users and Lists, associating the Users with first name "First"
    // to the List that has "First" in the name, and then the same for "Second"
    // and "Third".
    users.forEach(user => {
        if (["First", "Second", "Third"].includes(user.firstName)) {
            lists.forEach(list => {
                if (list.name.includes(user.firstName)) {
                    MockUserServices.listsInclude(user.id, list.id);
                }
            });
        }
    });

}

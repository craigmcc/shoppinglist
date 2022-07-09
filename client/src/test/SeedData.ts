// SeedData ------------------------------------------------------------------

// Seed data for client side tests.

// IMPLEMENTATION NOTE:  There is no requirement to keep that data here consistent
// with the corresponding seed data for server side tests, but it would certainly
// assist developers who are building tests for both side to not have to switch
// assumptions as they go back and forth.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Category from "../models/Category";
import Item from "../models/Item";
import List from "../models/List";
import User from "../models/User";

// Seed Data -----------------------------------------------------------------

// ***** Categories *****

export const CATEGORY_NAME_FIRST = "First Category";
export const CATEGORY_NAME_SECOND = "Second Category";
export const CATEGORY_NAME_THIRD = "Third Category";

export const CATEGORIES: Partial<Category>[] = [
    {
        name: CATEGORY_NAME_FIRST,
    },
    {
        active: false,
        name: CATEGORY_NAME_SECOND,
        notes: "This is the second category",
        theme: "aqua",
    },
    {
        name: CATEGORY_NAME_THIRD,
    },
];

// *** Items ***

export const ITEM_NAME_FIRST = "First Item";
export const ITEM_NAME_SECOND = "Second Item";
export const ITEM_NAME_THIRD = "Third Item";

export const ITEMS: Partial<Item>[] = [
    {
        name: ITEM_NAME_FIRST,
    },
    {
        active: false,
        name: ITEM_NAME_SECOND,
        notes: "This is the second item",
        theme: "aqua",
    },
    {
        name: ITEM_NAME_THIRD,
    },
];

// *** Lists ***

export const LIST_NAME_FIRST = "First List";
export const LIST_NAME_SECOND = "Second List";
export const LIST_NAME_THIRD = "Third List";

export const LISTS: Partial<List>[] = [
    {
        name: LIST_NAME_FIRST,
    },
    {
        active: false,
        name: LIST_NAME_SECOND,
        notes: "This is the second list",
        theme: "aqua",
    },
    {
        name: LIST_NAME_THIRD,
    },
];

// ***** Users *****

export const USER_SCOPE_SUPERUSER = "superuser";
export const USER_SCOPE_FIRST_ADMIN = `first:admin`;
export const USER_SCOPE_FIRST_REGULAR = `first:regular`;
export const USER_SCOPE_SECOND_ADMIN = `second:admin`;
export const USER_SCOPE_SECOND_REGULAR = `second:regular`;
export const USER_SCOPE_THIRD_ADMIN = `third:admin`;
export const USER_SCOPE_THIRD_REGULAR = `third:regular`;

export const USER_USERNAME_SUPERUSER = "superuser";
export const USER_USERNAME_FIRST_ADMIN = "firstadmin";
export const USER_USERNAME_FIRST_REGULAR = "firstregular";
export const USER_USERNAME_SECOND_ADMIN = "secondadmin";
export const USER_USERNAME_SECOND_REGULAR = "secondregular";
export const USER_USERNAME_THIRD_ADMIN = "thirdadmin";
export const USER_USERNAME_THIRD_REGULAR = "thirdregular";

export const USERS: Partial<User>[] = [
    {
        active: true,
        email: "first.admin@example.com",
        firstName: "First",
        lastName: "Admin",
        scope: USER_SCOPE_FIRST_ADMIN,
        username: USER_USERNAME_FIRST_ADMIN,
    },
    {
        active: true,
        email: "first.regular@example.com",
        firstName: "First",
        lastName: "Regular",
        scope: USER_SCOPE_FIRST_REGULAR,
        username: USER_USERNAME_FIRST_REGULAR,
    },
    {
        active: false,
        email: "second.admin@example.com",
        firstName: "Second",
        lastName: "Admin",
        scope: USER_SCOPE_SECOND_ADMIN,
        username: USER_USERNAME_SECOND_ADMIN,
    },
    {
        active: false,
        email: "second.regular@example.com",
        firstName: "Second",
        lastName: "Regular",
        scope: USER_SCOPE_SECOND_REGULAR,
        username: USER_USERNAME_SECOND_REGULAR,
    },
    {
        active: true,
        email: "third.admin@example.com",
        firstName: "Third",
        lastName: "Admin",
        scope: USER_SCOPE_THIRD_ADMIN,
        username: USER_USERNAME_THIRD_ADMIN,
    },
    {
        active: true,
        email: "third.regular@example.com",
        firstName: "Third",
        lastName: "Regular",
        scope: USER_SCOPE_THIRD_REGULAR,
        username: USER_USERNAME_THIRD_REGULAR,
    },
    {
        active: true,
        email: "superuser@example.com",
        firstName: "Superuser",
        lastName: "User",
        scope: USER_SCOPE_SUPERUSER,
        username: USER_USERNAME_SUPERUSER,
    }
];


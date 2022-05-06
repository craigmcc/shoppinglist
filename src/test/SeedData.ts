// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
//import Category from "../models/Category";
//import Item from "../models/Item";
//import List from "../models/List";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";

// Seed Data -----------------------------------------------------------------

// *** Access Tokens ***

const ONE_DAY = 24 * 60 * 60 * 1000;    // One day (milliseconds)

export const ACCESS_TOKENS_SUPERUSER: Partial<AccessToken>[] = [
    {
        expires: new Date(new Date().getTime() + ONE_DAY),
        scope: "superuser",
        token: "superuser_access_1",
        // userId must be seeded
    },
    {
        expires: new Date(new Date().getTime() - ONE_DAY),
        scope: "superuser",
        token: "superuser_access_2",
        // userId must be seeded
    },
];

// *** Categories ***

/*
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
*/

// *** Items ***

/*
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
*/

// *** Lists ***

/*
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
*/


// *** Refresh Tokens ***

export const REFRESH_TOKENS_SUPERUSER: Partial<RefreshToken>[] = [
    {
        accessToken: "superuser_access_1",
        expires: new Date(new Date().getTime() + ONE_DAY),
        token: "superuser_refresh_1",
        // userId must be seeded
    },
    {
        accessToken: "superuser_access_2",
        expires: new Date(new Date().getTime() - ONE_DAY),
        token: "superuser_refresh_2",
        // userId must be seeded
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
        firstName: "First",
        lastName: "Admin",
        scope: USER_SCOPE_FIRST_ADMIN,
        username: USER_USERNAME_FIRST_ADMIN,
    },
    {
        active: true,
        firstName: "First",
        lastName: "Regular",
        scope: USER_SCOPE_FIRST_REGULAR,
        username: USER_USERNAME_FIRST_REGULAR,
    },
    {
        active: false,
        firstName: "Second",
        lastName: "Admin",
        scope: USER_SCOPE_SECOND_ADMIN,
        username: USER_USERNAME_SECOND_ADMIN,
    },
    {
        active: false,
        firstName: "Second",
        lastName: "Regular",
        scope: USER_SCOPE_SECOND_REGULAR,
        username: USER_USERNAME_SECOND_REGULAR,
    },
    {
        active: true,
        firstName: "Third",
        lastName: "Admin",
        scope: USER_SCOPE_THIRD_ADMIN,
        username: USER_USERNAME_THIRD_ADMIN,
    },
    {
        active: true,
        firstName: "Third",
        lastName: "Regular",
        scope: USER_SCOPE_THIRD_REGULAR,
        username: USER_USERNAME_THIRD_REGULAR,
    },
    {
        active: true,
        firstName: "Superuser",
        lastName: "User",
        scope: USER_SCOPE_SUPERUSER,
        username: USER_USERNAME_SUPERUSER,
    }
];


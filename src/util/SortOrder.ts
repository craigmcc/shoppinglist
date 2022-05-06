// SortOrder -----------------------------------------------------------------

// Standard "order" values for each defined Model

// External Modules ----------------------------------------------------------

import {Order} from "sequelize";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKENS: Order = [
    [ "userId", "ASC" ],
    [ "expires", "DESC" ],
];

export const CATEGORIES: Order = [
    [ "groupId", "ASC" ],
    [ "name", "ASC" ],
];

export const ITEMS: Order = [
    [ "name", "ASC" ],
];

export const LISTS: Order = [
    [ "groupId", "ASC" ],
    [ "name", "ASC" ],
];

export const REFRESH_TOKENS: Order = [
    [ "userId", "ASC" ],
    [ "expires", "DESC" ],
];

export const USERS: Order = [
    [ "username", "ASC" ],
];


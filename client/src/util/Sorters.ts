// Sorters -------------------------------------------------------------------

// Utility functions to sort arrays of objects into the preferred order.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Category from "../models/Category";
import Item from "../models/Item";
import List from "../models/List";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKENS = (accessTokens: AccessToken[]): AccessToken[] => {
    return accessTokens.sort(function (a, b) {
        if (a.expires > b.expires) {
            return 1;
        } else if (a.expires < b.expires) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const CATEGORIES = (categories: Category[]): Category[] => {
    return categories.sort(function (a, b) {
        if (a.listId > b.listId) {
            return 1;
        } else if (a.listId < b.listId) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const ITEMS = (items: Item[]): Item[] => {
    return items.sort(function (a, b) {
        if (a.listId > b.listId) {
            return 1;
        } else if (a.listId < b.listId) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const LISTS = (lists: List[]): List[] => {
    return lists.sort(function(a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const REFRESH_TOKENS = (refreshTokens: RefreshToken[]): RefreshToken[] => {
    return refreshTokens.sort(function (a, b) {
        if (a.expires > b.expires) {
            return 1;
        } else if (a.expires < b.expires) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const USERS = (users: User[]): User[] => {
    return users.sort(function (a, b) {
        if (a.username > b.username) {
            return 1;
        } else if (a.username < b.username) {
            return -1;
        } else {
            return 0;
        }
    });
}


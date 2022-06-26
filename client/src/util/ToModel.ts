// ToModel -------------------------------------------------------------------

// Convert arbitrary objects or arrays to the specified Model objects.

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Category from "../models/Category";
import Item from "../models/Item";
import List from "../models/List";
import RefreshToken from "../models/RefreshToken";
import Share from "../models/Share";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const ACCESS_TOKEN = (value: object): AccessToken => {
    return new AccessToken(value);
}

export const ACCESS_TOKENS = (values: object[]): AccessToken[] => {
    const results: AccessToken[] = [];
    values.forEach(value => {
        results.push(new AccessToken(value));
    });
    return results;
}

export const CATEGORY = (value: object): Category => {
    return new Category(value);
}

export const CATEGORIES = (values: object[]): Category[] => {
    const results: Category[] = [];
    values.forEach(value => {
        results.push(new Category(value));
    });
    return results;
}

export const ITEM = (value: object): Item => {
    return new Item(value);
}

export const ITEMS = (values: object[]): Item[] => {
    const results: Item[] = [];
    values.forEach(value => {
        results.push(new Item(value));
    });
    return results;
}

export const LIST = (value: object): List => {
    return new List(value);
}

export const LISTS = (values: object[]): List[] => {
    const results: List[] = [];
    values.forEach(value => {
        results.push(new List(value));
    });
    return results;
}

export const REFRESH_TOKEN = (value: object): RefreshToken => {
    return new RefreshToken(value);
}

export const REFRESH_TOKENS = (values: object[]): RefreshToken[] => {
    const results: RefreshToken[] = [];
    values.forEach(value => {
        results.push(new RefreshToken(value));
    });
    return results;
}

export const SHARE = (value: object): Share => {
    return new Share(value);
}

export const USER = (value: object): User => {
    return new User(value);
}

export const USERS = (values: object[]): User[] => {
    const results: User[] = [];
    values.forEach(value => {
        results.push(new User(value));
    });
    return results;
}


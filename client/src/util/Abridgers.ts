// Abridgers -----------------------------------------------------------------

// Return abridged versions of model objects for use in log events.

// Internal Modules ----------------------------------------------------------

import Category from "../models/Category";
import Item from "../models/Item";
import List from "../models/List";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const CATEGORY = (category: Category): object => {
    return {
        id: category.id,
        listId: category.listId,
        name: category.name,
    };
}

export const CATEGORIES = (categories: Category[]): object[] => {
    const results: object[] = [];
    categories.forEach(category => {
        results.push(CATEGORY(category));
    });
    return results;
}

export const ITEM = (item: Item): object => {
    return {
        id: item.id,
        listId: item.id,
        name: item.name,
    };
}

export const ITEMS = (items: Item[]): object[] => {
    const results: object[] = [];
    items.forEach(item => {
        results.push(ITEM(item));
    });
    return results;
}

export const LIST = (list: List): object => {
    return {
        id: list.id,
        name: list.name,
    };
}

export const LISTS = (lists: List[]): object[] => {
    const results: object[] = [];
    lists.forEach(list => {
        results.push(LIST(list));
    });
    return results;
}

export const USER = (user: User): object => {
    return {
        id: user.id,
        username: user.username,
    };
}

export const USERS = (users: User[]): object[] => {
    const results: object[] = [];
    users.forEach(user => {
        results.push(USER(user));
    });
    return results;
}

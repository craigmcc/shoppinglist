// BaseUtils -----------------------------------------------------------------

// Base utilities for functional tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import AccessToken from "../models/AccessToken";
import Category from "../models/Category";
import Database from "../models/Database";
import Item from "../models/Item";
import List from "../models/List";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import UserList from "../models/UserList";
import {hashPassword} from "../oauth/OAuthUtils";

// Public Objects ------------------------------------------------------------

export type OPTIONS = {
    withAccessTokens: boolean,
    withCategories: boolean,
    withItems: boolean,
    withLists: boolean,
    withRefreshTokens: boolean,
    withUsers: boolean,
};

/**
 * Base utilities for functional tests.
 */
export abstract class BaseUtils {

    /**
     * Erase current database, then load seed data for the tables selected
     * in the options parameter.
     *
     * @param options                   Flags to select tables to be loaded
     */
    public async loadData(options: Partial<OPTIONS>): Promise<void> {

        // Create tables (if necessary), and erase current contents
        await Database.sync({
            force: true,
        });

        // Load users (and tokens) if requested
        let users: User[] = [];
        if (options.withUsers) {
            users = await loadUsers(SeedData.USERS);
            const userSuperuser = await User.findOne({
                where: { username: SeedData.USER_USERNAME_SUPERUSER }
            });
            if (userSuperuser) {
                if (options.withAccessTokens) {
                    await loadAccessTokens(userSuperuser, SeedData.ACCESS_TOKENS_SUPERUSER);
                }
                if (options.withRefreshTokens) {
                    await loadRefreshTokens(userSuperuser, SeedData.REFRESH_TOKENS_SUPERUSER);
                }
            }
        }

        // Load Lists (and related Categories and Items) if requested
        let lists: List[] = [];
        if (options.withLists) {
            lists = await loadLists(SeedData.LISTS);
            if (options.withCategories) {
                let categories: Partial<Category>[] = [];
                lists.forEach(list => {
                    SeedData.CATEGORIES.forEach(category => {
                        categories.push({ ...category, listId: list.id });
                    });
                });
                categories = await loadCategories(categories);
                if (options.withItems) {
                    let items: Partial<Item>[] = [];
                    lists.forEach((list, index) => {
                        SeedData.ITEMS.forEach(item => {
                            items.push({ ...item, categoryId: categories[index].id, listId: list.id });
                        });
                    });
                    items = await loadItems(items);
                }
            }
        }

        // If both Users and Lists were loaded, link them
        // What this does: create UserList links between
        // the two Users that have "First" as a first name,
        // to the List that has "First" in it -- and then the
        // same for "Second" and "Third".  The admin flag is
        // set to true for the admin User, and false for
        // the regular User.
        if (options.withUsers && options.withLists) {
            let userLists: Partial<UserList>[] = [];
            users.forEach(async user => {
                let listIndex = -1;
                if (user.firstName === "First") {
                    listIndex = 0;
                } else if (user.firstName === "Second") {
                    listIndex = 1;
                } else if (user.firstName === "Third") {
                    listIndex = 2;
                }
                if (listIndex >= 0) {
                    userLists.push({
                        admin: user.lastName === "Admin",
                        listId: lists[listIndex].id,
                        userId: user.id,
                    })
                }
            });
            // @ts-ignore
            await UserList.bulkCreate(userLists);
        }

    }

}

export default BaseUtils;

// Private Objects -----------------------------------------------------------

const loadAccessTokens
    = async (user: User, accessTokens: Partial<AccessToken>[]): Promise<AccessToken[]> => {
    accessTokens.forEach(accessToken => {
        accessToken.userId = user.id;
    });
    let results: AccessToken[] = [];
    try {
        // @ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        results = await AccessToken.bulkCreate(accessTokens);
        return results;
    } catch (error) {
        console.info(`  Reloading AccessTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const loadCategories = async (categories: Partial<Category>[]): Promise<Category[]> => {
    try {
        //@ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        return await Category.bulkCreate(categories, {returning: true});
    } catch (error) {
        console.info(`  Reloading Categories ERROR`, error);
        throw error;
    }
}

const loadItems = async (items: Partial<Item>[]): Promise<Item[]> => {
    try {
        //@ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        return await Item.bulkCreate(items, {returning: true});
    } catch (error) {
        console.info(`  Reloading Items ERROR`, error);
        throw error;
    }
}

const loadLists = async (lists: Partial<List>[]): Promise<List[]> => {
    try {
        //@ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        return await List.bulkCreate(lists, {returning: true});
    } catch (error) {
        console.info(`  Reloading Lists ERROR`, error);
        throw error;
    }
}

const loadRefreshTokens
    = async (user: User, refreshTokens: Partial<RefreshToken>[]): Promise<RefreshToken[]> => {
    refreshTokens.forEach(refreshToken => {
        refreshToken.userId = user.id;
    });
    let results: RefreshToken[] = [];
    try {
        // @ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        results = await RefreshToken.bulkCreate(refreshTokens);
        return results;
    } catch (error) {
        console.info(`  Reloading RefreshTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const hashedPassword = async (password: string | undefined): Promise<string> => {
    return hashPassword(password ? password : "");
}

const loadUsers = async (users: Partial<User>[]): Promise<User[]> => {
    // For tests, the unhashed password is the same as the username
    const promises = users.map(user => hashedPassword(user.username));
    const hashedPasswords: string[] = await Promise.all(promises);
    for(let i = 0; i < users.length; i++) {
        users[i].password = hashedPasswords[i];
    }
    try {
        // @ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        return User.bulkCreate(users);
    } catch (error) {
        console.info("  Reloading Users ERROR", error);
        throw error;
    }
}


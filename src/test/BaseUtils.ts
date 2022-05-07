// BaseUtils -----------------------------------------------------------------

// Base utilities for functional tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import AccessToken from "../models/AccessToken";
//import Category from "../models/Category";
import Database from "../models/Database";
//import Item from "../models/Item";
import List from "../models/List";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import {clearMapping} from "../oauth/OAuthMiddleware";
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

        // Clear any previous OAuth mapping for Library id -> scope
        clearMapping();

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

        // Load lists (and related items) if requested
        if (options.withLists) {
            const lists = await loadLists(SeedData.LISTS);
            if (options.withUsers) {
                // TODO: establish relevant relationships
            }
        }

/*
        // Load groups (and related children) if requested
        if (options.withGroups) {
            const groups = await loadGroups(SeedData.GROUPS);
            if (options.withCategories) {
                let categories: Partial<Category>[] = [];
                groups.forEach(group => {
                    SeedData.CATEGORIES.forEach(category => {
                        categories.push({ ...category, groupId: group.id });
                    });
                });
                categories = await loadCategories(categories);
                if (options.withItems) {
                    let items: Partial<Item>[] = [];
                    groups.forEach(group => {
                        SeedData.ITEMS.forEach(item => {
                            const newItem: Partial<Item> = { ...item, groupId: group.id };
                            let categoryId: string | undefined;
                            categories.forEach(category => {
                                if (!categoryId && (category.groupId === group.id)) {
                                    categoryId = category.id;
                                }
                            })
                            newItem.categoryId = categoryId;
                            items.push(newItem);
                        });
                    });
                    items = await loadItems(items);
                }
            }
            if (options.withLists) {
                let lists: Partial<List>[] = [];
                groups.forEach(group => {
                    SeedData.LISTS.forEach(list => {
                        lists.push({ ...list, groupId: group.id });
                    });
                });
                lists = await loadLists(lists);
            }
        }
*/

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

/*
const loadCategories = async (categories: Partial<Category>[]): Promise<Category[]> => {
    try {
        //@ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        return await Category.bulkCreate(categories, {returning: true});
    } catch (error) {
        console.info(`  Reloading Categories ERROR`, error);
        throw error;
    }
}
*/

/*
const loadItems = async (items: Partial<Item>[]): Promise<Item[]> => {
    try {
        //@ts-ignore NOTE - did Typescript get tougher about Partial<M>?
        return await Item.bulkCreate(items, {returning: true});
    } catch (error) {
        console.info(`  Reloading Items ERROR`, error);
        throw error;
    }
}
*/

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


// AsyncValidators -----------------------------------------------------------

// Custom (to this application) validation methods that can only be used by
// server side applications, because they interact directly with the database.
// A "true" return value means that the validation was successful,
// while "false" means it was not.  If a field is required, that must be
// validated separately.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
//import Category from "../models/Category";
import RefreshToken from "../models/RefreshToken";
//import Item from "../models/Item";
//import List from "../models/List";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const validateAccessTokenTokenUnique
    = async (accessToken: AccessToken): Promise<boolean> =>
{
    if (accessToken && accessToken.token) {
        let options: any = {
            where: {
                token: accessToken.token,
            }
        }
        if (accessToken.id) {
            options.where.id = { [Op.ne]: accessToken.id }
        }
        const results = await AccessToken.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

/*
export const validateCategoryNameUnique
    = async (category: Category): Promise<boolean> =>
{
    if (category && category.name) {
        let options = {};
        if (category.id) {
            options = {
                where: {
                    id: {[Op.ne]: category.id},
                    groupId: category.groupId,
                    name: category.name
                }
            }
        } else {
            options = {
                where: {
                    groupId: category.groupId,
                    name: category.name
                }
            }
        }
        let results = await Category.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}
*/


/*
export const validateItemNameUnique
    = async (item: Item): Promise<boolean> =>
{
    if (item && item.name) {
        let options = {};
        if (item.id) {
            options = {
                where: {
                    id: {[Op.ne]: item.id},
                    groupId: item.groupId,
                    name: item.name
                }
            }
        } else {
            options = {
                where: {
                    groupId: item.groupId,
                    name: item.name
                }
            }
        }
        let results = await Item.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}
*/

/*
export const validateListNameUnique
    = async (list: List): Promise<boolean> =>
{
    if (list && list.name) {
        let options = {};
        if (list.id) {
            options = {
                where: {
                    id: {[Op.ne]: list.id},
                    groupId: list.groupId,
                    name: list.name
                }
            }
        } else {
            options = {
                where: {
                    groupId: list.groupId,
                    name: list.name
                }
            }
        }
        let results = await List.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}
*/

export const validateRefreshTokenTokenUnique
    = async (refreshToken: RefreshToken): Promise<boolean> =>
{
    if (refreshToken && refreshToken.token) {
        let options: any = {
            where: {
                token: refreshToken.token,
            }
        }
        if (refreshToken.id) {
            options.where.id = { [Op.ne]: refreshToken.id }
        }
        const results = await RefreshToken.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateUserUsernameUnique
    = async (user: User): Promise<boolean> =>
{
    if (user && user.username) {
        let options = {};
        if (user.id) {
            options = {
                where: {
                    id: {[Op.ne]: user.id},
                    username: user.username
                }
            }
        } else {
            options = {
                where: {
                    username: user.username
                }
            }
        }
        let results = await User.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}


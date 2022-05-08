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
import Category from "../models/Category";
import RefreshToken from "../models/RefreshToken";
import Item from "../models/Item";
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

export const validateCategoryNameUnique
    = async (category: Category): Promise<boolean> =>
{
    if (category && category.name) {
        let options = {};
        if (category.id) {
            options = {
                where: {
                    id: {[Op.ne]: category.id},
                    listId: category.listId,
                    name: category.name
                }
            }
        } else {
            options = {
                where: {
                    listId: category.listId,
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

export const validateItemNameUnique
    = async (item: Item): Promise<boolean> =>
{
    if (item && item.name) {
        let options = {};
        if (item.id) {
            options = {
                where: {
                    id: {[Op.ne]: item.id},
                    listId: item.listId,
                    name: item.name
                }
            }
        } else {
            options = {
                where: {
                    listId: item.listId,
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


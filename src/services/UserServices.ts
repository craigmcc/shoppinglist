// UserServices --------------------------------------------------------------

// Services implementation for User models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import ListServices from "./ListServices";
import BaseParentServices from "./BaseParentServices";
import List from "../models/List";
import User from "../models/User";
import UserList from "../models/UserList";
import {hashPassword} from "../oauth/OAuthUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";

// Public Classes ------------------------------------------------------------

class UserServices extends BaseParentServices<User> {

    constructor () {
        super(User, SortOrder.USERS, [
            "active",
            "email",
            "firstName",
            "lastName",
            "password",
            "scope",
            "username",
        ]);
    }

    // Standard CRUD Operations ----------------------------------------------

    // NOTE: Overrides to redact password in all returned values

    public async all(query?: object): Promise<User[]> {
        const results = await super.all(query);
        results.forEach(result => {
            result.password = "";
        });
        return results;
    }

    public async find(userId: string, query?: any): Promise<User> {
        const result = await super.find(userId, query);
        result.password = "";
        return result;
    }

    public async insert(user: Partial<User>): Promise<User> {
        if (!user.password) {
            throw new BadRequest(
                `password: Is required`,
                "UserServices.insert"
            );
        }
        user.password = await hashPassword(user.password); // NOTE - leaked back to caller
        const result = await super.insert(user);
        result.password = "";
        return result;
    }

    public async remove(userId: string): Promise<User> {
        const result = await super.remove(userId);
        result.password = "";
        return result;
    }

    public async update(userId: string, user: Partial<User>): Promise<User> {
        if (user.password && (user.password.length > 0)) {
            user.password = await hashPassword(user.password); // NOTE - leaked back to caller
        } else {
            delete user.password;
        }
        const result = await super.update(userId, user);
        result.password = "";
        return result;
    }

    // Model-Specific Methods ------------------------------------------------

    public async exact(username: string, query?: any): Promise<User> {
        let options: FindOptions = this.appendIncludeOptions({
            where: { username: username }
        }, query);
        const results = await User.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `username: Missing User '${username}'`,
                "UserServices.exact");
        }
        results[0].password = "";
        return results[0];
    }

    public async lists(userId: string, query?: any): Promise<List[]> {
        const user = await this.read("UserServices.lists", userId);
        // TODO : options
        return user.$get("lists"/*, options*/);
    }

    public async listsExclude(userId: string, listId: string): Promise<List> {
        const user = await this.read("UserServices.listsExclude", userId);
        const list = await ListServices.read("UserServices.listsExclude", listId);
        await user.$remove("lists", list);
        return list;
    }

    public async listsInclude(userId: string, listId: string, admin?: boolean): Promise<List> {
        const user = await this.read("UserServices.listsInclude", userId);
        const list = await ListServices.read("UserServices.listsInclude", listId);
        // @ts-ignore
        await UserList.upsert({
            admin: (admin !== undefined) ? admin : true,
            listId: listId,
            userId: userId,
        });
        return list;
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withLists                      Include authorized Lists
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if (""  === query.withLists) {
            include.push(List);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active Users
     * * username={wildcard}            Select Users with username matching {wildcard}
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.active = true;
        }
        if (query.username) {
            where.username = { [Op.iLike]: `%${query.username}%` };
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new UserServices();

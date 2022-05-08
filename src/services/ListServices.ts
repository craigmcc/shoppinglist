// ListServices --------------------------------------------------------------

// Services implementation for List models.


import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseParentServices from "./BaseParentServices";
import Category from "../models/Category";
import Item from "../models/Item";
import List from "../models/List";
import User from "../models/User";
import UserList from "../models/UserList";
import CategoryServices from "./CategoryServices";
import ItemServices from "./ItemServices";
import UserServices from "../services/UserServices";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";

// Public Classes ------------------------------------------------------------

class ListServices extends BaseParentServices<List> {

    constructor () {
        super(List, SortOrder.LISTS, [
            "active",
            "name",
            "notes",
            "theme",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    public async categories(listId: string, query?: any): Promise<Category[]> {
        const list = await this.read("ListServices.categories", listId);
        const options: FindOptions = CategoryServices.appendMatchOptions({
            order: SortOrder.CATEGORIES,
        }, query);
        return list.$get("categories", options);
    }

    public async items(listId: string, query?: any): Promise<Item[]> {
        const list = await this.read("ListServices.items", listId);
        const options: FindOptions = ItemServices.appendMatchOptions({
            order: SortOrder.ITEMS,
        }, query);
        return list.$get("items", options);
    }

    public async users(listId: string, query?: any): Promise<User[]> {
        const list = await this.read("ListServices.users", listId);
        const options: FindOptions = UserServices.appendMatchOptions({
            order: SortOrder.USERS,
        }, query);
        return list.$get("users", options);
    }

    public async usersExclude(listId: string, userId: string): Promise<User> {
        const list = await this.read("ListServices.usersExclude", listId);
        const user = await UserServices.read("ListServices.usersExclude", userId);
        await list.$remove("users", user);
        return user;
    }

    public async usersInclude(listId: string, userId: string, admin?: boolean): Promise<User> {
        const list = await this.read("ListServices.usersExclude", listId);
        const user = await UserServices.read("ListServices.usersExclude", userId);
        // @ts-ignore
        await UserList.upsert({
            admin: (admin !== undefined) ? admin : true,
            listId: listId,
            userId: userId,
        });
        return user;
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withUsers                      Include authorized Users
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withUsers) {
            include.push(User);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active Lists
     * * name={wildcard}                Select Lists with name matching {wildcard}
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
        if (query.name) {
            where.name = { [Op.iLike]: `%${query.name}%`};
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new ListServices();

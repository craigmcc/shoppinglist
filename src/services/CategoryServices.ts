// CategoryServices ----------------------------------------------------------

// Services implementation for Category models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseChildServices from "./BaseChildServices";
import ItemServices from "./ItemServices";
import Category from "../models/Category";
import Item from "../models/Item";
import List from "../models/List";
import {NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";

// Public Classes ------------------------------------------------------------

class CategoryServices extends BaseChildServices<Category, List> {

    constructor () {
        super(List, Category, SortOrder.LISTS, [
            "active",
            "listId",
            "name",
            "notes",
            "theme",
        ]);
    }

    // Model-Specific Methods ------------------------------------------------

    public async exact(listId: string, name: string, query?: any): Promise<Category> {
        let options: FindOptions = this.appendIncludeOptions({
            where: {
                listId: listId,
                name: name,
            }
        }, query);
        const result = await Category.findOne(options);
        if (result) {
            return result;
        } else {
            throw new NotFound(
                `name: Missing Category '${name}'`,
                "CategoryServices.exact");
        }
    }

    public async items(listId: string, categoryId: string, query?: any): Promise<Item[]> {
        const category = await this.read("CategoryServices.items", listId, categoryId);
        const options: FindOptions = ItemServices.appendMatchOptions({
            order: SortOrder.ITEMS,
        }, query);
        return category.$get("items", options);
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withItems                      Include child Items
     * * withList                       Include parent List
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withItems) {
            include.push(Item);
        }
        if ("" === query.withList) {
            include.push(List);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active Categories
     * * name={wildcard}                Select Categories with name matching {wildcard}
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
            where.name = { [Op.iLike]: `%${query.name}%` };
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new CategoryServices();

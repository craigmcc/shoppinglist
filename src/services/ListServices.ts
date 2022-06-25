// ListServices --------------------------------------------------------------

// Services implementation for List models.

// External Modules ----------------------------------------------------------

import Mail from "nodemailer/lib/mailer";
import {FindOptions, Op} from "sequelize";
const uuid = require("uuid");

// Internal Modules ----------------------------------------------------------

import BaseParentServices from "./BaseParentServices";
import EmailServices from "./EmailServices";
import Category from "../models/Category";
import Item from "../models/Item";
import List from "../models/List";
import Share from "../models/Share";
import User from "../models/User";
import UserList from "../models/UserList";
import CategoryServices from "./CategoryServices";
import ItemServices from "./ItemServices";
import UserServices from "../services/UserServices";
import {validateUuid} from "../util/ApplicationValidators";
import {InitialListData} from "../util/InitialListData";
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

    /**
     * Clear the checked and selected flags for all Items belonging to this List.
     *
     * @param listId                    ID of the List whose Items are to be cleared
     */
    public async clear(listId: string): Promise<List> {
        const list = await this.read("ListServices.clear", listId);
        await Item.update({
            checked: false,
            selected: false,
        }, {
            where: {
                listId: listId,
            }
        });
        return list;
    }

    public async items(listId: string, query?: any): Promise<Item[]> {
        const list = await this.read("ListServices.items", listId);
        const options: FindOptions = ItemServices.appendMatchOptions({
            order: SortOrder.ITEMS,
        }, query);
        return list.$get("items", options);
    }

    /**
     * Populate Categories and Items for the specified List (which should have none).
     * Then, return the List with its new nested elements.
     *
     * @param listId                    ID of the list to be populated
     * @param options                   Optional Sequelize options
     */
    public async populate(listId: string, options?: any): Promise<List> {

        const categories: Category[] = [];
        const items: Item[] = [];
        const populateOptions = options ? options : {};

        // Populate the categories we are creating
        InitialListData.forEach(element => {
            // @ts-ignore
            categories.push({
                id: uuid.v4(),
                listId: listId,
                name: element[0],
            });
        });
        await Category.bulkCreate(categories, populateOptions);

        // Populate the items we are creating
        InitialListData.forEach((element, i) => {
            if (element.length > 1) {
                for (let j = 1; j < element.length; j++) {
                    // @ts-ignore
                    items.push({
                        id: uuid.v4(),
                        categoryId: categories[i].id,
                        listId: listId,
                        name: element[j],
                    });
                }
            }
        });
        await Item.bulkCreate(items, populateOptions);

        // Return this List with its nested Categories and Items
        return await List.findOne({
            ...populateOptions,
            include: [ Category, Item ],
            where: { id : listId }
        });

    }

    /**
     * Email an offer to share the specified List with a new or existing
     * User at the specified email address.
     *
     * @param listId                    ID of the List being offered
     * @param email                     Email address of the offeree
     * @param admin                     Will this user receive admin permissions?
     *
     * @return Share representing this offer
     */
    public async share(listId: string, offer: Partial<Share>): Promise<Share> {

        // Look up the list to be shared
        const list = await this.read("ListServices.categories", listId, {
            withUsers: "",
        });

        // Record an offer of this List to this User
        const input: Partial<Share> = {
            id: uuid.v4(),
            admin: offer.admin,
            email: offer.email,
            listId: listId, // No cheating
        };
        // Email a message containing the offer to this User
        // TODO - instruct them to create a new login first if new
        // TODO - link to the accept UI
        const message: Mail.Options = {
            html: `
                <p>
                    ${list.users[0].firstName} ${list.users[0].lastName}
                    is offering to share a Shopping List named
                    ${list.name} with you.
                </p>
            `,
            subject: "Offer to access a ShoppingList shared list",
            text: `
                    ${list.users[0].firstName} ${list.users[0].lastName}
                    is offering to share a Shopping List named
                    ${list.name} with you.
            `,
            to: input.email,
        }
        await EmailServices.send(message);

        // Create and return a Share instance for this offer
        // @ts-ignore
        const output = await Share.create(input);
        return output;

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
     * * withCategories                 Include configured Categories
     * * withItems                      Include configured Items
     * * withUsers                      Include authorized Users
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withCategories) {
            include.push(Category);
        }
        if ("" === query.withItems) {
            include.push(Item);
        }
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
     * * listId={listId}                Select List with specified id
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
        if (query.listId) {
            // Guarantee a no-match if invalid UUID format
            where.id = validateUuid(query.listId) ? query.listId : uuid.v4();
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

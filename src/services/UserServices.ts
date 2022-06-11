// UserServices --------------------------------------------------------------

// Services implementation for User models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, Transaction} from "sequelize";
const uuid = require("uuid");

// Internal Modules ----------------------------------------------------------

import ListServices from "./ListServices";
import BaseParentServices from "./BaseParentServices";
import CreateAccount from "../models/CreateAccount";
import List from "../models/List";
import User from "../models/User";
import UserList from "../models/UserList";
import {hashPassword} from "../oauth/OAuthUtils";
import {BadRequest, NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";
import * as SortOrder from "../util/SortOrder";
import Database from "../models/Database";

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

    public async insert(user: Partial<User>, options?: any): Promise<User> {
        if (!user.password) {
            throw new BadRequest(
                `password: Is required`,
                "UserServices.insert"
            );
        }
        user.password = await hashPassword(user.password); // NOTE - leaked back to caller
        const result = await super.insert(user, options);
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

    public async create(createUser: CreateAccount): Promise<User> {

        let transaction: Transaction | null = null;
        try {

            // Start a transaction
            transaction = await Database.transaction();

            // Create the requested User
            const user = await this.insert({
                id: uuid.v4(),
                active: true,
                email: createUser.email,
                firstName: createUser.firstName,
                lastName: createUser.lastName,
                password: createUser.password1,
                scope: "TODO",
                username: createUser.username,
            }, {
                transaction: transaction,
            });

            if (createUser.listName) {

                // Create the associated List (if requested)
                const list = await ListServices.insert({
                    id: uuid.v4(),
                    active: true,
                    name: createUser.listName,
                }, {
                    transaction: transaction,
                })

                // Associate the User and List
                // @ts-ignore
                await UserList.upsert({
                    admin: true,
                    listId: list.id,
                    userId: user.id,
                }, {
                    transaction: transaction,
                });

                // If requested, populate the standard Categories and Items
                if (createUser.populate) {
                    await ListServices.populate(list.id, {
                        transaction: transaction
                    });
                }

            }

            // Commit the transaction
            await transaction.commit();

            // Return the new User with its nested List
            return await this.find(user.id, {
                withLists: "",
            });

        } catch (error) {

            // Roll back the transaction (if any) and rethrow the error
            if (transaction) {
                await transaction.rollback();
            }
            throw error;

        }

        // @ts-ignore
        return this.find(user.id, {
            withLists: ""
        });

    }

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
        const options: FindOptions = ListServices.appendMatchOptions({
            order: SortOrder.LISTS,
        }, query);
        return await user.$get("lists", options);
    }

    public async listsExclude(userId: string, listId: string): Promise<List> {
        const user = await this.read("UserServices.listsExclude", userId);
        const list = await ListServices.read("UserServices.listsExclude", listId);
        await user.$remove("lists", list);
        return list;
    }

    public async listsInclude(userId: string, listId: string, admin?: boolean, options?: any): Promise<List> {
        const user = await this.read("UserServices.listsInclude", userId);
        const list = await ListServices.read("UserServices.listsInclude", listId);
        // @ts-ignore
        await UserList.upsert({
            admin: (admin !== undefined) ? admin : true,
            listId: listId,
            userId: userId,
        }, options);
        return list;
    }

    public async listsInsert(userId: string, list: Partial<List>): Promise<List> {

        let transaction: Transaction;
        try {

            // Start a transaction
            transaction = await Database.transaction();

            // Create the new List
            const insertee: Partial<List> = {
                ...list,
                id: list.id ? list.id : uuid.v4(),
            }
            // @ts-ignore
            const inserted = await List.create(insertee, {transaction});

            // Associate it with the specified User
            const upsertee: Partial<UserList> = {
                admin: true,
                listId: inserted.id,
                userId: userId,
            }
            // @ts-ignore
            await UserList.upsert(upsertee, {transaction});

            // Commit transaction and return the result
            await transaction.commit();
            return inserted;

        } catch (error) {
            // @ts-ignore
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
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

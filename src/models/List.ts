// List ----------------------------------------------------------------------

// A List of Items to be potentially purchased, administered  by, or available
// to, zero or more Users.

// External Modules ----------------------------------------------------------

import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import Item from "./Item";
import Share from "./Share";
import User from "./User";
import UserList from "./UserList";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "lists",
    timestamps: false,
    version: false,
})
class List extends Model<List> {

    @Column({
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "id",
        primaryKey: true,
        type: DataType.UUID,
    })
    // Primary key for this List
    id!: string;

    @Column({
        allowNull: false,
        defaultValue: true,
        field: "active",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required",
            }
        }
    })
    // Is this List active?
    active!: boolean;

    @HasMany(() => Category, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Categories owned by this List
    categories!: Category[];

    @HasMany(() => Item, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Items owned by this List
    items!: Item[];

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "name: Is required"
            },
        }
    })
    // Name of this list (NOT unique)
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.TEXT
    })
    // General notes about this List
    notes?: string;

    @HasMany(() => Share, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Shares owned by this List
    shares!: Share[];

    @Column({
        allowNull: true,
        field: "theme",
        type: DataType.TEXT
    })
    // Presentation theme for this List (for future use)
    theme?: string;

    // Join Table contents, present only if User retrieved with withLists
    UserList?: UserList;

    @BelongsToMany(() => User, () => UserList)
    // Related Users, present only if List retrieved with withUsers
    users!: Array<User & {Userlist: UserList}>;

}

export default List;

// List ----------------------------------------------------------------------

// A list of Items to be potentially purchased, administered  by or available
// to, zero or more Users.

// External Modules ----------------------------------------------------------

import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

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
    // TODO: Per-User(s)??? unique name of this List
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.TEXT
    })
    // General notes about this List
    notes?: string;

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

// UserList ------------------------------------------------------------------

// A relationship (admin or regular) between a specified User and a
// specified List.

// External Modules ---------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ---------------------------------------------------------

import List from "../models/List";
import User from "../models/User";

// Public Objects -----------------------------------------------------------

@Table({
    tableName: "users_lists",
    timestamps: false,
    version: false,
})
class UserList extends Model<UserList> {

    @Column({
        allowNull: false,
        defaultValue: true,
        field: "admin",
        type: DataType.BOOLEAN,
    })
    // Does this user have administrative (true) or regular (false) permissions on this List?
    admin?: boolean;

    // Order is to get the primary key constraint in the correct order

    @BelongsTo(() => User)
    user!: User;

    @Column({
        allowNull: false,
        field: "user_id",
        primaryKey: true,
        type: DataType.UUID,
    })
    @ForeignKey(() => User)
    // ID of the source User in this relationship
    userId!: string;

    @BelongsTo(() => List)
    list!: List;

    @Column({
        allowNull: false,
        field: "list_id",
        primaryKey: true,
        type: DataType.UUID,
    })
    @ForeignKey(() => List)
    // ID of the destination List in this relationship
    listId!: string;

}

export default UserList;

// Share ---------------------------------------------------------------------

// An outstanding offer to share the specified List with a User with the
// specified Email address.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import List from "./List";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "shares",
    timestamps: false,
    version: false,
})
class Share extends Model<Share> {

    @Column({
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "id",
        primaryKey: true,
        type: DataType.UUID,
    })
    // Primary key for this Share
    id!: string;

    @Column({
        allowNull: false,
        defaultValue: true,
        field: "admin",
        type: DataType.BOOLEAN,
    })
    // Will this user have administrative permissions on this List?
    admin?: boolean;

    @Column({
        allowNull: false,
        field: "email",
        type: DataType.TEXT,
    })
    // Email address of the person this Share was extended to
    email!: string;

    @Column({
        allowNull: false,
        field: "expires",
        type: DataType.DATE,
        validate: {
            notNull: {
                msg: "expires: Is required",
            }
        }
    })
    // Timestamp when this Share will no longer be valid
    expires!: Date;

    @BelongsTo(() => List, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // List that owns this Share
    list!: List;

    @ForeignKey(() => List)
    @Column({
        allowNull: false,
        field: "list_id",
        type: DataType.UUID,
        unique: "uniqueNameWithinList",
        validate: {
            notNull: {
                msg: "listId: Is required",
            }
        }
    })
    // ID of the List that owns this Share
    listId!: string;

    // Google reCAPTCHA v2 token (when accept is processed), not persisted
    token?: string;

}

export default Share;

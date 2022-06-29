// Password ------------------------------------------------------------------

// An outstanding offer to reset the password for a User with the
// specified email address.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import User from "./User";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "passwords",
    timestamps: false,
    version: false,
})
class Password extends Model<Password> {

    @Column({
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "id",
        primaryKey: true,
        type: DataType.UUID,
    })
    // Primary key for this Password
    id!: string;

    @Column({
        allowNull: false,
        field: "email",
        type: DataType.TEXT,
    })
    // Email address of the person this Password will reset the password for
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
    // Timestamp when this Password will no longer be valid
    expires!: Date;

    // First password value specified by the User (not persisted)
    password1?: string;

    // Second password value specified by the User (not persisted)
    password2?: string;

    // Google reCAPTCHA v2 token (when accept is processed), not persisted
    token?: string;

    @BelongsTo(() => User, {
        foreignKey: {
            allowNull: true,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // User that owns this Password
    user!: User;

    @ForeignKey(() => User)
    @Column({
        allowNull: true,
        field: "user_id",
        type: DataType.UUID,
    })
    // ID of the User that owns this Password (if any)
    userId?: string;

}

export default Password;

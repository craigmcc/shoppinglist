// AccessToken ---------------------------------------------------------------

// OAuth access token created by @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import User from "./User";
import {validateAccessTokenTokenUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "access_tokens",
    timestamps: false,
    validate: {
        isAccessTokenTokenUnique: async function (this: AccessToken): Promise<void> {
            if (!(await validateAccessTokenTokenUnique(this))) {
                throw new BadRequest
                (`token: Token '${this.token}' is already in use`);
            }
        },
    },
    version: false,
})
class AccessToken extends Model<AccessToken> {

    @Column({
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "id",
        primaryKey: true,
        type: DataType.UUID,
    })
    // Primary key for this AccessToken
    id!: string;

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
    // Timestamp after which this token is no longer valid
    expires!: Date;

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "scope: Is required",
            }
        }
    })
    // Scope(s) granted to this token
    scope!: string;

    @Column({
        allowNull: false,
        field: "token",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "token: Is required",
            }
        }
    })
    // Access token value for use in transmitting HTTP requests
    token!: string;

    @BelongsTo(() => User, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // User that owns this AccessToken
    user!: User;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        field: "user_id",
        type: DataType.UUID,
        validate: {
            notNull: {
                msg: "userId: Is required",
            }
        }
    })
    // ID of the User that owns this AccessToken
    userId!: string;

}

export default AccessToken;

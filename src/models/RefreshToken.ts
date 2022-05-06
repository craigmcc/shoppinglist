// RefreshToken ---------------------------------------------------------------

// OAuth refresh token created by @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import User from "./User";
import {validateRefreshTokenTokenUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "refresh_tokens",
    timestamps: false,
    validate: {
        isRefreshTokenTokenUnique: async function (this: RefreshToken): Promise<void> {
            if (!(await validateRefreshTokenTokenUnique(this))) {
                throw new BadRequest
                (`token: Token '${this.token}' is already in use`);
            }
        },
    },
    version: false,
})
class RefreshToken extends Model<RefreshToken> {

    @Column({
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "id",
        primaryKey: true,
        type: DataType.UUID
    })
    // Primary key for this RefreshToken
    id!: string;

    @Column({
        allowNull: false,
        field: "access_token",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "accessToken: Is required",
            }
        }
    })
    // Access token value this RefreshToken is associated with
    accessToken!: string;

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
        field: "token",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "token: Is required",
            }
        }
    })
    // Refresh token value for use in transmitting HTTP requests
    token!: string;

    @BelongsTo(() => User, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // User that owns this RefreshToken
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
    // ID of the User that owns this RefreshToken
    userId!: string;

}

export default RefreshToken;

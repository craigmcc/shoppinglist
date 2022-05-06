// User ----------------------------------------------------------------------

// User that can be authenticated via @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import {validateUserUsernameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "users",
    timestamps: false,
    validate: {
        isUserUsernameUnique: async function (this: User): Promise<void> {
            if (!(await validateUserUsernameUnique(this))) {
                throw new BadRequest
                (`username: Username '${this.username}' is already in use`);
            }
        }
    },
    version: false,
})
class User extends Model<User> {

    @Column({
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "id",
        primaryKey: true,
        type: DataType.UUID,
    })
    // Primary key for this User
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
    // Is this User active?
    active!: boolean;

    @Column({
        allowNull: true,
        field: "email",
        type: DataType.TEXT,
    })
    // Email address for this User
    email!: string;

    @Column({
        allowNull: false,
        field: "first_name",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "firstName: Is required",
            }
        }
    })
    // First Name of this User
    firstName!: string;

    @Column({
        allowNull: false,
        field: "last_name",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "lastName: Is required",
            }
        }
    })
        // First Name of this User
    lastName!: string;

    @Column({
        allowNull: false,
        field: "password",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "password: Is required",
            }
        }
    })
    // Login password for this User (hashed in the database)
    password!: string;

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
    // Scope(s) authorized for this User
    scope!: string;

    @Column({
        allowNull: false,
        field: "username",
        type: DataType.TEXT,
        unique: "uniqueUserUsername",
        validate: {
            notNull: {
                msg: "username: Is required",
            }
        }
    })
    // Login username for this User
    username!: string;

}

export default User;

// Category ----------------------------------------------------------------------

// An individual shopping list that belongs to a List.

// External Module -----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import List from "./List";
import {validateCategoryNameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "categories",
    timestamps: false,
    validate: {
        isNameUnique: async function(this: Category): Promise<void> {
            if (!(await validateCategoryNameUnique(this))) {
                throw new BadRequest
                   (`name: Name '${this.name}' is already in use`);
            }
        },
    },
    version: false,
})
class Category extends Model<Category> {

    @Column({
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "id",
        primaryKey: true,
        type: DataType.UUID,
    })
    // Primary key for this Category
    id!: string;

    @Column({
        allowNull: false,
        defaultValue: true,
        field: "active",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required"
            }
        }
    })
    // Is this Category active?
    active!: boolean;

    @BelongsTo(() => List, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // List that owns this Category
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
    // ID of the List that owns this Category
    listId!: string;

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.TEXT,
        unique: "uniqueNameWithinList",
        validate: {
            notNull: {
                msg: "name: Is required"
            },
        }
    })
    // Per-list unique name of this Category
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.TEXT
    })
    // General notes about this Category
    notes?: string;

    @Column({
        allowNull: true,
        field: "theme",
        type: DataType.TEXT
    })
    // Presentation theme (for future use)
    theme?: string;

}

export default Category;

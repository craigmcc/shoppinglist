// Item ----------------------------------------------------------------------

// An individual item that can be selected for a List, belonging to a Category.

// External Module -----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import List from "./List";
import {validateItemNameUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "items",
    timestamps: false,
    validate: {
        isNameUnique: async function(this: Item): Promise<void> {
            if (!(await validateItemNameUnique(this))) {
                throw new BadRequest
                    (`name: Name '${this.name}' is already in use`);
            }
        },
    },
    version: false,
})
class Item extends Model<Item> {

    @Column({
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        field: "id",
        primaryKey: true,
        type: DataType.UUID,
    })
    // Primary key for this Item
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
    // Is this Item active?
    active!: boolean;

    @BelongsTo(() => Category, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // Category this Item is assigned to
    category!: Category;

    @ForeignKey(() => Category)
    @Column({
        allowNull: false,
        field: "category_id",
        type: DataType.UUID,
        validate: {
            notNull: {
                msg: "categoryId: Is required",
            }
        }
    })
    // ID of the Category this Item is assigned to
    categoryId!: string;

    @Column({
        allowNull: false,
        defaultValue: false,
        field: "checked",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "checked: Is required"
            }
        }
    })
    // If selected, has this item been checked off already?
    checked!: boolean;

    @BelongsTo(() => List, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    // List that owns this Item
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
    // ID of the List that owns this Item
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
    // Per-list unique name of this Item
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.TEXT
    })
    // General notes about this Item
    notes?: string;

    @Column({
        allowNull: false,
        defaultValue: false,
        field: "selected",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "selected: Is required"
            }
        }
    })
    // Is this Item currently selected for display on this List?
    selected!: boolean;

    @Column({
        allowNull: true,
        field: "theme",
        type: DataType.TEXT
    })
    // Presentation theme (for future use)
    theme?: string;

}

export default Item;

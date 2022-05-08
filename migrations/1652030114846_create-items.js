/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable("items", {
        id: {
            notNull: true,
            primaryKey: true,
            type: "uuid",
        },
        active: {
            default: true,
            notNull: true,
            type: "boolean",
        },
        category_id: {
            onDelete: "cascade",
            onUpdate: "cascade",
            notNull: true,
            references: "categories",
            type: "uuid",
        },
        checked: {
            default: false,
            notNull: true,
            type: "boolean",
        },
        list_id: {
            onDelete: "cascade",
            onUpdate: "cascade",
            notNull: true,
            references: "lists",
            type: "uuid",
        },
        name: {
            notNull: true,
            type: "text",
        },
        notes: {
            type: "text",
        },
        selected: {
            default: false,
            notNull: true,
            type: "boolean",
        },
        theme: {
            type: "text",
        },
    });

    pgm.createIndex("items", ["list_id", "name"], {
        name: "items_list_id_name_key",
        unique: true,
    });

};

//exports.down = pgm => {};

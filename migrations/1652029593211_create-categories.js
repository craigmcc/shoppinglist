/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable("categories", {
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
        theme: {
            type: "text",
        },
    });

    pgm.createIndex("categories", ["list_id", "name"], {
        name: "categories_list_id_name_key",
        unique: true,
    });

};

//exports.down = pgm => {};

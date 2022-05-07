/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable("lists", {
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

    pgm.createIndex("lists", ["name"], {
        name: "lists_name_key",
        unique: false,
    });

};

//exports.down = pgm => {};

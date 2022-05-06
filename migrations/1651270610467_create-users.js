/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable("users", {
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
        email: {
            type: "text",
        },
        first_name: {
            notNull: true,
            type: "text",
        },
        last_name: {
            notNull: true,
            type: "text",
        },
        password: {
            notNull: true,
            type: "text",
        },
        scope: {
            notNull: true,
            type: "text",
        },
        username: {
            notNull: true,
            type: "text",
        },
    });

    pgm.createIndex("users", "username", {
        name: "users_username_key",
        unique: true,
    });

};

//exports.down = pgm => {};

/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable("users_lists", {
        admin: {
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
        user_id: {
            onDelete: "cascade",
            onUpdate: "cascade",
            notNull: true,
            references: "users",
            type: "uuid",
        },
    });

    pgm.addConstraint("users_lists", "users_lists_pk", {
        primaryKey: ["user_id", "list_id"],
    });

};

// exports.down = pgm => {};

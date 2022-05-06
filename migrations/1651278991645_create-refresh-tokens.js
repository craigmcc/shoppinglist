/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable("refresh_tokens", {
        id: {
            notNull: true,
            primaryKey: true,
            type: "uuid",
        },
        access_token: {
            notNull: true,
            type: "text",
        },
        expires: {
            notNull: true,
            type: "timestamp with time zone",
        },
        token: {
            notNull: true,
            type: "text",
        },
        user_id: {
            onDelete: "cascade",
            onUpdate: "cascade",
            notNull: true,
            references: "users",
            type: "uuid",
        },
    });

    pgm.createIndex("refresh_tokens", "token", {
        name: "refresh_tokens_token_key",
        unique: true,
    });

};

// exports.down = pgm => {};

// QueryParameters -----------------------------------------------------------

// Utility methods for appending to Sequelize options based on query parameters,
// for general purpose queries.

// External Modules ----------------------------------------------------------

import {FindOptions} from "sequelize";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Append standard pagination query parameters "limit" and "offset" (if present),
 * and return the updated options.
 *
 * @param options                       Previously accumulated FindOptions
 * @param query                         Query parameters from current HTTP request
 *
 * @returns                             Updated FindOptions
 */
export const appendPaginationOptions = (options: FindOptions, query: any): FindOptions => {
    if (query.limit) {
        let value = parseInt(query.limit, 10);
        if (isNaN(value)) {
            throw new Error(`limit: '${query.limit}' is not a number`);
        } else {
            options.limit = value;
        }
    }
    if (query.offset) {
        let value = parseInt(query.offset, 10);
        if (isNaN(value)) {
            throw new Error(`offset: '${query.offset}' is not a number`);
        } else {
            options.offset = value;
        }
    }
    return options;
}

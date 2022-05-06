// AccessTokenServices -------------------------------------------------------

// Services implementation for AccessToken models.
// NOTE:  No CRUD operations are defined, so we do not extend the usual base class.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import User from "../models/User";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Classes ------------------------------------------------------------

class AccessTokenServices {

    // Model-Specific Methods ------------------------------------------------

    public async purge(): Promise<object> {
        const purgeBefore = new Date((new Date().getTime()) - PURGE_BEFORE_MS);
        const purgeCount = await AccessToken.destroy({
            where: { expires: { [Op.lte]: purgeBefore }}
        });
        return {
            purgeBefore: purgeBefore.toLocaleString(),
            purgeCount: purgeCount,
        }
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withUser                       Include parent User
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withUser) {
            include.push(User);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * active                         Select unexpired tokens
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.expires = {[Op.gte]: Date.now()};
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

}

export default new AccessTokenServices();

const PURGE_BEFORE_MS = 24 * 60 * 60 * 1000; // 24 hours (in milliseconds)

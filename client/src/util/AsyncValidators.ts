// AsyncValidators -----------------------------------------------------------

// Custom (to this application) validation methods that must interact with
// the server asynchronously to perform their validations.  In all cases,
// a "true" return value indicates that the proposed value is valid, while
// "false" means it is not.  If a field is required, that must be validated
// separately.

// The methods defined here should correspond (in name and parameters) to
// the similar ones in the server side AsynchValidators set, because they
// perform the same semantic functions.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import List from "../models/List";
import User, {USERS_BASE} from "../models/User";
import {queryParameters} from "./QueryParameters";
import * as ToModel from "./ToModel";

// Public Objects ------------------------------------------------------------

// List names must be unique for the specified User, not globally unique
export const validateListNameUnique = async (user: User, list: List): Promise<boolean> => {
    if (user && user.id && list && list.name) {
        try {
            const parameters = {
                name: list.name,
            }
            const url = USERS_BASE
                + `/${user.id}/lists`
                + queryParameters(parameters);
            const results = ToModel.LISTS((await Api.get(url)).data);
            results.forEach(result => {
                if (result.name === list.name) {
                    return false;
                }
            });
            return true;
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateUserUsernameUnique = async (user: User): Promise<boolean> => {
    if (user && user.username) {
        try {
            const result = (await Api.get(USERS_BASE
                + `/exact/${user.username}`)).data;
            return (result.id === user.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

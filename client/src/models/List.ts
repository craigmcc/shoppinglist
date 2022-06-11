// List ----------------------------------------------------------------------

// A List of Items to be potentially purchased, administered  by, or available
// to, zero or more Users.

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import Item from "./Item";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const LISTS_BASE = "/lists";

export class ListData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : null;
        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.populate = (data.populate !== undefined) ? data.populate : true;
        this.theme = data.theme ? data.theme : null;
        if (data.UserList && (data.UserList.admin !== undefined)) {
            this.admin = data.UserList.admin;
        } else {
            this.admin = false;
        }
    }

    id: string;
    active: boolean;
    admin: boolean;
    name: string;
    notes: string;
    populate: boolean; // Only referenced on a list creation
    theme: string;

}

class List extends ListData {

    constructor(data: any = {}) {
        super(data);
        this.categories = data.categories ? ToModel.CATEGORIES(data.categories) : undefined;
        this.items = data.items ? ToModel.ITEMS(data.items) : undefined;
    }

    categories?: Category[];
    items?: Item[];

}

export default List;

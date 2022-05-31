// Category ------------------------------------------------------------------

// An individual shopping list that belongs to a List.

// Internal Modules ----------------------------------------------------------

import Item from "./Item";
import List from "./List";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const CATEGORIES_BASE = "/categories";

export class CategoryData {

    constructor(data: any = {}) {
        this.id = data.id ? data.id : null;
        this.active = (data.active !== undefined) ? data.active : true;
        this.listId = data.listId ? data.listId : null;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.theme = data.theme ? data.theme : null;
    }

    id: string;
    active: boolean;
    listId: string;
    name: string;
    notes: string;
    theme: string;

}

class Category extends CategoryData {

    constructor(data: any = {}) {
        super(data);
        this.items = data.items ? ToModel.ITEMS(data.items) : undefined;
        this.list = data.list ? ToModel.LIST(data.list) : undefined;
    }

    items?: Item[];
    list?: List;

}

export default Category;

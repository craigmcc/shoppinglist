// Item ----------------------------------------------------------------------

// An individual item that can be selected for a List, belonging to a Category.

// Internal Modules ----------------------------------------------------------

import Category from "./Category";
import List from "./List";
import Model from "./Model";
import * as ToModel from "../util/ToModel";

// Public Objects ------------------------------------------------------------

export const ITEMS_BASE = "/items";

export class ItemData extends Model<Item> {

    constructor(data: any = {}) {
        super();
        this.id = data.id ? data.id : null;
        this.active = (data.active !== undefined) ? data.active : true;
        this.categoryId = data.categoryId ? data.categoryId : null;
        this.checked = (data.checked !== undefined) ? data.checked : false;
        this.listId = data.listId ? data.listId : null;
        this.name = data.name ? data.name : null;
        this.notes = data.notes ? data.notes : null;
        this.selected = (data.selected !== undefined) ? data.selected : false;
        this.theme = data.theme ? data.theme : null;
    }

    id: string;
    active: boolean;
    categoryId: string;
    checked: boolean;
    listId: string;
    name: string;
    notes: string;
    selected: boolean;
    theme: string;

}

class Item extends ItemData {

    constructor(data: any = {}) {
        super(data);
        this.category = data.category ? ToModel.CATEGORY(data.category) : undefined;
        this.list = data.list ? ToModel.LIST(data.list) : undefined;
    }

    category?: Category;
    get categoryName() {
        return this.category?.name;
    }
    list?: List;

}

export default Item;

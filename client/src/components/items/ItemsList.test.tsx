// ItemsList.test ------------------------------------------------------------

// Unit tests for ItemsList.

// External Modules ----------------------------------------------------------

import React from "react";
import {
    act,
    getByRole,
    getByTestId,
    getByText,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Internal Modules ----------------------------------------------------------

import ItemsList from "./ItemsList";
import {CURRENT_ITEM_KEY, CURRENT_LIST_KEY} from "../../constants";
import Category from "../../models/Category";
import Item from "../../models/Item";
import List from "../../models/List";
import MockItemServices from "../../test/services/MockItemServices";
import MockListServices from "../../test/services/MockListServices";
import * as SeedData from "../../test/SeedData";
import LocalStorage from "../../util/LocalStorage";

// Test Infrastructure -------------------------------------------------------

const elements = (): {
    // Fields
    rows: HTMLElement[],
    // Buttons
    add: HTMLElement,
} => {

    // Omit the row from the table header
    let rows = screen.getAllByRole("row");
    if (rows && (rows.length > 1)) {
        rows.shift();
    } else {
        rows = [];
    }
    const add = screen.getByTestId("add");

    return {
        rows,
        add,
    }

}

const storedItem = new LocalStorage<Category>(CURRENT_ITEM_KEY);
const storedList = new LocalStorage<List>(CURRENT_LIST_KEY);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Test Methods --------------------------------------------------------------

describe("ItemsList", () => {

    beforeEach(() => {
        storedItem.value = new Item();
        storedList.value = new List();
    })

    test("Add Button", async () => {

        const {list} = lookupItems(SeedData.LIST_NAME_SECOND);
        await act(async () => {
            render(<ItemsList/>);
        });

        const {add} = elements();
        const client = userEvent.setup();
        await client.click(add);
        await waitFor(() => {
            expect(mockNavigate).toBeCalledWith("/item");
            expect(storedItem.value.listId).toBe(list.id);
        });

    });

    test("Edit Settings Option", async () => {

        const {items} = lookupItems(SeedData.LIST_NAME_THIRD);
        await act(async () => {
            render(<ItemsList/>);
        });

        const client = userEvent.setup();
        const {rows} = elements();
        expect(rows.length).toEqual(items.length);
        const INDEX = 0;
        const dropdown = getByTestId(rows[INDEX], "dropdown");
        const button = getByRole(dropdown, "button");
        await client.click(button);
        const editSettings = getByText(dropdown, "Edit Settings");
        await client.click(editSettings);
        expect(mockNavigate).toBeCalledWith("/item");
        expect(storedItem.value.id).toBe(items[INDEX].id);

    });

    test("Renders Successfully", async () => {

        const {items} = lookupItems(SeedData.LIST_NAME_THIRD);
        await act(async () => {
            render(<ItemsList/>);
        });

        const client = userEvent.setup();
        const {rows} = elements();
        expect(rows.length).toEqual(items.length);
        rows.forEach(async (row, index) => {
            getByText(row, items[index].name);
            if (items[index].notes) {
                getByText(row, items[index].name);
            }
            expect(items[index].category).toBeDefined();
            expect(items[index].categoryName).toBeDefined();
            if (items[index].categoryName) {
                // @ts-ignore
                getByText(row, items[index].categoryName);
            }
            const dropdown = getByTestId(row, "dropdown");
            const button = getByRole(dropdown, "button");
            await client.click(button);
            getByText(dropdown, "Edit Settings");
        });

    });

});

// Helper Objects ------------------------------------------------------------

const lookupItems = (listName: string): {list: List, items: Item[]} => {
    const list = MockListServices.exact(listName);
    storedList.value = list;
    expect(storedList.value.id).toBe(list.id);
    const items = MockItemServices.all(list.id);
    expect(items.length).toBeGreaterThan(0);
    return {list: list, items: items};
}

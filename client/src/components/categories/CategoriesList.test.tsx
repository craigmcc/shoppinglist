// CategoriesList.test -------------------------------------------------------

// Unit tests for CategoriesList.

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

import CategoriesList from "./CategoriesList";
import {CURRENT_CATEGORY_KEY, CURRENT_LIST_KEY} from "../../constants";
import Category from "../../models/Category";
import List from "../../models/List";
import MockCategoryServices from "../../test/services/MockCategoryServices";
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

    const rows = screen.getAllByRole("row");
    const add = screen.getByTestId("add");

    return {
        rows,
        add,
    }

}

const storedCategory = new LocalStorage<Category>(CURRENT_CATEGORY_KEY);
const storedList = new LocalStorage<List>(CURRENT_LIST_KEY);

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Test Methods --------------------------------------------------------------

describe("CategoriesList", () => {

    beforeEach(() => {
        storedCategory.value = new Category();
        storedList.value = new List();
    })

    test("Add Button", async () => {

        const {list} = lookupCategories(SeedData.LIST_NAME_FIRST);
        await act(async () => {
            render(<CategoriesList/>)
        });

        const {add} = elements();
        const client = userEvent.setup();
        await client.click(add);
        await waitFor(() => {
            expect(mockNavigate).toBeCalledWith("/category");
            expect(storedCategory.value.listId).toBe(list.id);
        });

    });

    test("Edit Settings Option", async () => {

        const {categories} = lookupCategories(SeedData.LIST_NAME_SECOND);
        await act(async () => {
            render(<CategoriesList/>)
        });

        const client = userEvent.setup();
        const {rows} = elements();
        expect(rows.length).toEqual(categories.length);
        const INDEX = 0;
        const dropdown = getByTestId(rows[INDEX], "dropdown");
        const button = getByRole(dropdown, "button");
        await client.click(button);
        const editSettings = getByText(dropdown, "Edit Settings");
        await client.click(editSettings);
        expect(mockNavigate).toBeCalledWith("/category");
        expect(storedCategory.value.id).toBe(categories[INDEX].id);

    });

    test("Renders Successfully", async () => {

        const {categories} = lookupCategories(SeedData.LIST_NAME_THIRD);
        await act(async () => {
            render(<CategoriesList/>)
        });

        const client = userEvent.setup();
        const {rows} = elements();
        expect(rows.length).toEqual(categories.length);
        rows.forEach(async (row, index) => {
            getByText(row, categories[index].name);
            if (categories[index].notes) {
                getByText(row, categories[index].notes);
            }
            const dropdown = getByTestId(row, "dropdown");
            const button = getByRole(dropdown, "button");
            await client.click(button);
            getByText(dropdown, "Edit Settings");
        });

    });

});

// Helper Objects ------------------------------------------------------------

const lookupCategories = (listName: string): {list: List, categories: Category[]} => {
    const list = MockListServices.exact(listName);
    storedList.value = list;
    expect(storedList.value.id).toBe(list.id);
    const categories = MockCategoryServices.all(list.id);
    expect(categories.length).toBeGreaterThan(0);
    return {list: list, categories: categories};
}


// CategoriesList.test -------------------------------------------------------

// Unit tests for CategoriesList.

// External Modules ----------------------------------------------------------

import React from "react";
import {act, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Internal Modules ----------------------------------------------------------

import CategoriesList, {Props} from "./CategoriesList";
import {CURRENT_CATEGORY_KEY, CURRENT_LIST_KEY} from "../../constants";
import Category from "../../models/Category";
import List from "../../models/List";
import User from "../../models/User";
import MockCategoryServices from "../../test/services/MockCategoryServices";
import MockListServices from "../../test/services/MockListServices";
import MockUserServices from "../../test/services/MockUserServices";
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

    describe("Valid Data", () => {

        it("should handle Add button click correctly", async () => {

            const LIST = MockListServices.exact(SeedData.LIST_NAME_THIRD);
            const CATEGORIES = MockCategoryServices.all(LIST.id);
            expect(CATEGORIES.length).toBeGreaterThan(0);
            storedCategory.value = new Category();
            storedList.value = LIST;
            expect(storedList.value.id).toBe(LIST.id);
            await act(async () => {
                render(<CategoriesList/>)
            });

            const {add} = elements();
            const client = userEvent.setup();
            await client.click(add);

            await waitFor(() => {
                expect(mockNavigate).toBeCalledWith("/category");
                const category = storedCategory.value;
                expect(category.listId).toBe(LIST.id);
            });

        });

        it("should render correctly on a valid List with Categories", async () => {

            const LIST = MockListServices.exact(SeedData.LIST_NAME_FIRST);
            const CATEGORIES = MockCategoryServices.all(LIST.id);
            expect(CATEGORIES.length).toBeGreaterThan(0);
            storedCategory.value = new Category();
            storedList.value = LIST;
            expect(storedList.value.id).toBe(LIST.id);
            await act(async () => {
                render(<CategoriesList/>)
            });

            const {rows} = elements();
            expect(rows.length).toEqual(CATEGORIES.length);

        });

    });

});

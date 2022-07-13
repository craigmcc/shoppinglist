// CategoryForm.test ---------------------------------------------------------

// Unit tests for CategoryForm.

// External Modules ----------------------------------------------------------

import React from "react";
import {act, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Internal Modules ----------------------------------------------------------

import CategoryForm, {Props} from "./CategoryForm";
import Category from "../../models/Category";
import MockCategoryServices from "../../test/services/MockCategoryServices";
import MockListServices from "../../test/services/MockListServices";
import * as SeedData from "../../test/SeedData";

// Test Infrastructure -------------------------------------------------------

const elements = (): {
    // Fields
    active: HTMLElement,
    name: HTMLElement,
    notes: HTMLElement,
    // Buttons
    save: HTMLElement,
} => {

    const active = screen.getByLabelText("Active?");
    const name = screen.getByLabelText("Category Name:");
    const notes = screen.getByLabelText("Notes:");

    expect(active).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toBeInTheDocument();

    return {
        active,
        name,
        notes,
        save,
    }

}

// Test Methods --------------------------------------------------------------

describe("CategoryForm", () =>{

    describe("Invalid Data", () => {

        it("should fail on duplicate name", async () => {

            const LIST = MockListServices.exact(SeedData.LIST_NAME_THIRD);
            const CATEGORIES = MockCategoryServices.all(LIST.id);
            const CATEGORY = {
                ...CATEGORIES[0],
                name: CATEGORIES[1].name,
            }
            const PROPS: Props = {
                category: CATEGORY,
                handleSave: jest.fn(),
            }
            await act(async () => {
                render(<CategoryForm {...PROPS}/>);
            })

            const {name, save} = elements();
            const client = userEvent.setup();
            await client.click(save);

            await waitFor(() => {
                expect(PROPS.handleSave).not.toBeCalled();
                screen.getByText("That name is already in use within this List");
            });

        })

        it("should fail on missing name", async () => {

            const LIST = MockListServices.exact(SeedData.LIST_NAME_FIRST);
            const CATEGORY = new Category({
                active: true,
                listId: LIST.id,
                name: null,
                notes: null,
            });
            const PROPS: Props = {
                category: CATEGORY,
                handleSave: jest.fn(),
            }
            await act(async () => {
                render(<CategoryForm {...PROPS}/>);
            });

            const {save} = elements();
            const client = userEvent.setup();
            await client.click(save);

            await waitFor(() => {
                expect(PROPS.handleSave).not.toBeCalled();
                screen.getByText("Name is required");
            });

        });

    });

    describe("Valid Data", () => {

        it("should pass validation on a name update", async () => {

            const LIST = MockListServices.exact(SeedData.LIST_NAME_THIRD);
            const CATEGORIES = MockCategoryServices.all(LIST.id);
            const CATEGORY = {
                ...CATEGORIES[0],
                name: "Completely brand new name",
            }
            const PROPS: Props = {
                category: CATEGORY,
                handleSave: jest.fn(),
            }
            await act(async () => {
                render(<CategoryForm {...PROPS}/>);
            })

            const {save} = elements();
            const client = userEvent.setup();
            await client.click(save);

            await waitFor(() => {
                expect(PROPS.handleSave).toBeCalled();
            });

        });

        it("should pass validation on a no change update", async () => {

            const LIST = MockListServices.exact(SeedData.LIST_NAME_FIRST);
            const CATEGORIES = MockCategoryServices.all(LIST.id);
            const CATEGORY = {
                ...CATEGORIES[0],
            }
            const PROPS: Props = {
                category: CATEGORY,
                handleSave: jest.fn(),
            }
            await act(async () => {
                render(<CategoryForm {...PROPS}/>);
            })

            const {save} = elements();
            const client = userEvent.setup();
            await client.click(save);

            await waitFor(() => {
                expect(PROPS.handleSave).toBeCalled();
            });

        });

        it("should pass validation on a notes update", async () => {

            const LIST = MockListServices.exact(SeedData.LIST_NAME_FIRST);
            const CATEGORIES = MockCategoryServices.all(LIST.id);
            const CATEGORY = {
                ...CATEGORIES[0],
                note: "Completely brand new note",
            }
            const PROPS: Props = {
                category: CATEGORY,
                handleSave: jest.fn(),
            }
            await act(async () => {
                render(<CategoryForm {...PROPS}/>);
            })

            const {save} = elements();
            const client = userEvent.setup();
            await client.click(save);

            await waitFor(() => {
                expect(PROPS.handleSave).toBeCalled();
            });

        });

    });

});

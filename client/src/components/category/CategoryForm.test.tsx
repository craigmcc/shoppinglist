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

    describe("Invalid data", () => {

        it("should fail on missing name", async () => {

            const LIST = MockListServices.exact(SeedData.LIST_NAME_FIRST);
            const CATEGORY = new Category({
                listId: LIST.id,
            })
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

            expect(PROPS.handleSave).not.toBeCalled();
// TODO            screen.getByText("name is required");

        });

    });

});

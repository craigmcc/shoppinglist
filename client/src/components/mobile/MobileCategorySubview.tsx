// MobileCategorySubview ---------------------------------------------------------

// Subview displayed to logged-in User for managing Categories.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import {MutatingProgress} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import MobileItemSubview from "./MobileItemSubview";
import CategoryForm from "../categories/CategoryForm";
import CategoryList from "../categories/CategoryList";
import {HandleAction, HandleCategory} from "../../types";
import useMutateCategory from "../../hooks/useMutateCategory";
import Category from "../../models/Category";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
    handleReturn: HandleAction;         // Handle return to parent subview
    list: List;                         // Parent List for these Categories
}

// Component Details -------------------------------------------------------

const MobileCategorySubview = (props: Props) => {

    enum View {
        FORM = "Form",
        ITEMS = "Items",
        LIST = "List",
    }

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [category, setCategory] = useState<Category>(new Category());
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.LIST);

    const mutateCategory = useMutateCategory({
        alertPopup: false,
        list: props.list,
    });

    useEffect(() => {
        logger.info({
            context: "MobileCategoriesView.useEffect",
            category: Abridgers.CATEGORY(category),
            list: Abridgers.LIST(props.list),
            view: view.toString(),
        });
        setCanInsert(true);
        setCanRemove(false);
        setCanUpdate(true);
    }, [props.list, category, view]);

    // Create an empty Category to be added
    const handleAdd: HandleAction = () => {
        const theCategory = new Category({
            active: true,
            listId: props.list.id,
            name: null,
            notes: null,
            theme: null,
        });
        logger.debug({
            context: "MobileCategorySubview.handleAdd",
            category: theCategory,
        });
        setCategory(theCategory);
        setView(View.FORM);
    }

    // Handle returning to the previous view
    const handleBack: HandleAction = () => {
        setView(View.LIST);
    }

    // Handle selection of a Category to edit details
    const handleEdit: HandleCategory = (theCategory) => {
        logger.debug({
            context: "MobileCategoriesView.handleEdit",
            list: Abridgers.CATEGORY(theCategory),
        });
        setCategory(theCategory);
        setView(View.FORM);
    }

    // Handle insert of a new Category
    const handleInsert: HandleCategory = async (theCategory) => {
        setMessage(`Inserting Category '${theCategory.name}'`);
        const inserted = await mutateCategory.insert(theCategory);
        logger.debug({
            context: "MobileCategorySubview.handleInsert",
            list: Abridgers.CATEGORY(inserted),
        });
        setView(View.LIST);
    }

    // Handle remove of an existing Category
    const handleRemove: HandleCategory = async (theCategory) => {
        setMessage(`Removing Category '${theCategory.name}'`);
        const removed = await mutateCategory.remove(theCategory);
        logger.debug({
            context: "MobileCategorySubview.handleRemove",
            list: Abridgers.CATEGORY(removed),
        });
        setView(View.LIST);
    }

    // Handle return to this subview
    const handleReturn: HandleAction = () => {
        setView(View.LIST);
    }

    // Handle selection of a Category to manage Items
    const handleSelect: HandleCategory = (theCategory) => {
        logger.info({
            context: "MobileCategorySubview.handleSelect",
            category: Abridgers.CATEGORY(theCategory),
        });
        setCategory(theCategory);
        setView(View.ITEMS);
    }

    // Handle update of an existing Category
    const handleUpdate: HandleCategory = async (theCategory) => {
        setMessage(`Updating Category '${theCategory.name}'`);
        const updated = await mutateCategory.update(theCategory);
        logger.debug({
            context: "MobileCategorySubview.handleUpdate",
            list: Abridgers.CATEGORY(updated),
        });
        setView(View.LIST);
    }

    return (
        <>

            <MutatingProgress
                error={mutateCategory.error}
                executing={mutateCategory.executing}
                message={message}
            />

            {(view === View.FORM) ? (
                <CategoryForm
                    autoFocus={true}
                    category={category}
                    handleBack={handleBack}
                    handleInsert={(canInsert) ? handleInsert : undefined}
                    handleRemove={(canRemove) ? handleRemove : undefined}
                    handleUpdate={(canUpdate) ? handleUpdate : undefined}
                    list={props.list}
                />
            ) : null }

            {(view === View.ITEMS) ? (
                <MobileItemSubview
                    category={category}
                    handleReturn={handleReturn}
                    list={props.list}
                />
            ) : null }

            {(view === View.LIST) ? (
                <CategoryList
                    handleAdd={(canInsert) ? handleAdd : undefined}
                    handleEdit={(canUpdate) ? handleEdit : undefined}
                    handleReturn={props.handleReturn}
                    handleSelect={handleSelect}
                    list={props.list}
                />
            ) : null }

        </>
    )

}

export default MobileCategorySubview;

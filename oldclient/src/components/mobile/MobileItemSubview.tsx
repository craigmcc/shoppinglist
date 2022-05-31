// MobileItemSubview ---------------------------------------------------------

// Subview displayed to logged-in User for managing Items.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import {MutatingProgress} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import ItemForm from "../items/ItemForm";
import ItemList from "../items/ItemList";
import {HandleAction, HandleItem} from "../../types";
import useMutateItem from "../../hooks/useMutateItem";
import Category from "../../models/Category";
import Item from "../../models/Item";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
    category?: Category;                // Optional parent Category for these Items
    handleReturn: HandleAction;         // Handle return to parent subview
    list: List;                         // Parent List for these Items
}

// Component Details -------------------------------------------------------

const MobileItemSubview = (props: Props) => {

    enum View {
        FORM = "Form",
        LIST = "List",
    }

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [item, setItem] = useState<Item>(new Item());
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.LIST);

    const mutateItem = useMutateItem({
        alertPopup: false,
        list: props.list,
    });

    useEffect(() => {
        logger.info({
            context: "MobileItemsSubview.useEffect",
            category: props.category ? Abridgers.CATEGORY(props.category) : undefined,
            item: item,
            list: Abridgers.LIST(props.list),
            view: view.toString(),
        });
        setCanInsert(true);
        setCanRemove(false);
        setCanUpdate(true);
    }, [props.category, props.list, item, view]);

    // Create an empty Item to be added
    const handleAdd: HandleAction = () => {
        const theItem = new Item({
            active: true,
            categoryId: props.category ? props.category.id : null,
            listId: props.list.id,
            name: null,
            notes: null,
            theme: null,
        });
        logger.info({
            context: "MobileItemSubview.handleAdd",
            item: theItem,
        });
        setItem(theItem);
        setView(View.FORM);
    }

    // Handle returning to the previous view
    const handleBack: HandleAction = () => {
        setView(View.LIST);
    }

    // Handle selection of a Item to edit details
    const handleEdit: HandleItem = (theItem) => {
        logger.info({
            context: "MobileItemsView.handleEdit",
            item: Abridgers.ITEM(theItem),
        });
        setItem(theItem);
        setView(View.FORM);
    }

    // Handle insert of a new Item
    const handleInsert: HandleItem = async (theItem) => {
        setMessage(`Inserting Item '${theItem.name}'`);
        const inserted = await mutateItem.insert(theItem);
        logger.info({
            context: "MobileItemSubview.handleInsert",
            item: inserted,
        });
        setView(View.LIST);
    }

    // Handle remove of an existing Item
    const handleRemove: HandleItem = async (theItem) => {
        setMessage(`Removing Item '${theItem.name}'`);
        const removed = await mutateItem.remove(theItem);
        logger.info({
            context: "MobileItemSubview.handleRemove",
            item: removed,
        });
        setView(View.LIST);
    }

    // Handle update of an existing Item
    const handleUpdate: HandleItem = async (theItem) => {
        setMessage(`Updating Item '${theItem.name}'`);
        const updated = await mutateItem.update(theItem);
        logger.info({
            context: "MobileItemSubview.handleUpdate",
            item: updated,
        });
        setView(View.LIST);
    }

    return (
        <>

            <MutatingProgress
                error={mutateItem.error}
                executing={mutateItem.executing}
                message={message}
            />

            {(view === View.FORM) ? (
                <ItemForm
                    autoFocus={true}
                    category={props.category ? props.category : undefined}
                    item={item}
                    handleBack={handleBack}
                    handleInsert={(canInsert) ? handleInsert : undefined}
                    handleRemove={(canRemove) ? handleRemove : undefined}
                    handleUpdate={(canUpdate) ? handleUpdate : undefined}
                    list={props.list}
                />
            ) : null }

            {(view === View.LIST) ? (
                <ItemList
                    category={props.category ? props.category : undefined}
                    handleAdd={(canInsert) ? handleAdd : undefined}
                    handleEdit={(canUpdate) ? handleEdit : undefined}
                    handleReturn={props.handleReturn}
                    list={props.list}
                />
            ) : null }

        </>
    )

}

export default MobileItemSubview;

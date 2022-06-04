// ItemView --------------------------------------------------------------

// Supports editing of a new or existing Item.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import ItemForm from "./ItemForm";
import ItemHeader from "./ItemHeader";
import {CURRENT_ITEM_KEY, CURRENT_LIST_KEY} from "../../constants";
import {HandleItem} from "../../types";
import useFetchCategories from "../../hooks/useFetchCategories";
import useLocalStorage from "../../hooks/useLocalStorage";
import useMutateItem from "../../hooks/useMutateItem";
import Item from "../../models/Item";
import List from "../../models/List";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ItemView = (props: Props) => {

    const [item] = useLocalStorage<Item>(CURRENT_ITEM_KEY);
    const [list] = useLocalStorage<List>(CURRENT_LIST_KEY);

    const fetchCategories = useFetchCategories({
        alertPopup: true,
        list: list,
    });
    const mutateItem = useMutateItem({
        alertPopup: true,
        list: list,
    });
    const navigate = useNavigate();

    useEffect(() => {
        logger.info({
            context: "ItemView.useEffect",
            list: list,
            item: item,
        });
    }, [item, list]);

    const handleSave: HandleItem = async (theItem) => {
        // TODO - mutating progess?
        try {
            let saved: Item;
            if (theItem.id) {
                saved = await mutateItem.update(theItem);
            } else {
                saved = await mutateItem.insert(theItem);
            }
            logger.debug({
                context: "ItemView.handleSave",
                item: saved,
            });
        } catch (error) {
            ReportError("ItemView.handleSave", error, {
                item: theItem,
            });
        }
        navigate("/items");
    }

    return (
        <>
            <ItemHeader item={item}/>
            <ItemForm
                autoFocus
                categories={fetchCategories.categories}
                item={item}
                handleSave={handleSave}
            />
        </>
    )

}

export default ItemView;

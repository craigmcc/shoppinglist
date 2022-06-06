// useFetchItems -------------------------------------------------------------

// Custom hook to fetch Item objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleAction} from "../types";
import Api from "../clients/Api";
import Item from "../models/Item";
import Category, {CATEGORIES_BASE} from "../models/Category";
import List, {LISTS_BASE} from "../models/List";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Items? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    category?: Category;                // Optional Category owning these items [use List]
    list: List;                         // List owning these Items
    name?: string;                      // Select Items matching pattern [none]
    selected?: boolean;                 // Select only selected Items? [false]
    withCategory?: boolean;             // Include parent Category? [false]
    withList?: boolean;                 // Include parent List? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    handleRefresh: HandleAction;        // Method to request refresh
    items: Item[];                      // Fetched Items
    loading: boolean;                   // Are we currently loading?
}

// Hook Details --------------------------------------------------------------

const useFetchItems = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {

        const fetchItems = async () => {

            setError(null);
            setLoading(true);
            let theItems: Item[] = [];

            const parameters = {
                active: props.active ? "" : undefined,
                name: props.name ? props.name : undefined,
                selected: props.selected ? "" : undefined,
                withCategory: props.withCategory  ? "" : undefined,
                withList: props.withList ? "" : undefined,
            }
            let url = props.category
                ? `${CATEGORIES_BASE}/${props.list.id}/${props.category.id}/items`
                : `${LISTS_BASE}/${props.list.id}/items`;
            url += `${queryParameters(parameters)}`;

            try {
                if (props.list.id) {
                    theItems = ToModel.ITEMS((await Api.get(url)).data);
                    logger.debug({
                        context: "useFetchItems.fetchItems",
                        category: props.category ? Abridgers.CATEGORY(props.category) : undefined,
                        items: Abridgers.ITEMS(theItems),
                        list: Abridgers.LIST(props.list),
                        url: url,
                    });
                } else {
                    logger.debug({
                        context: "useFetchItems.fetchItems",
                        msg: "Skipped fetching Items",
                        url: url,
                    });
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useFetchItems.fetchItems", anError, {
                    category: props.category ? Abridgers.CATEGORY(props.category) : undefined,
                    list: Abridgers.LIST(props.list),
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setItems(theItems);

        }

        fetchItems();

    }, [props.active, props.category, props.list, props.name,
        props.selected, props.withCategory, props.withList,
        alertPopup, refresh]);


    const handleRefresh: HandleAction = () => {
        setRefresh(true);
    }

    return {
        error: error ? error : null,
        handleRefresh: handleRefresh,
        items: items,
        loading: loading,
    }

}

export default useFetchItems;

// useFetchCategories ---------------------------------------------------------

// Custom hook to fetch Category objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import Category, {CATEGORIES_BASE} from "../models/Category";
import List from "../models/List";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Categories? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    list: List;                         // List owning these Categories
    name?: string;                      // Select Categories matching pattern [none]
    withItems?: boolean;                // Include child Items? [false]
    withList?: boolean;                 // Include parent List? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    categories: Category[];              // Fetched Categories
}

// Hook Details --------------------------------------------------------------

const useFetchCategories = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {

        const fetchCategories = async () => {

            setError(null);
            setLoading(true);
            let theCategories: Category[] = [];

            const parameters = {
                active: props.active ? "" : undefined,
                name: props.name ? props.name : undefined,
                withItems: props.withItems  ? "" : undefined,
                withList: props.withList ? "" : undefined,
            }
            const url = `${CATEGORIES_BASE}/${props.list.id}${queryParameters(parameters)}`;

            try {
                if (props.list.id) {
                    theCategories = ToModel.CATEGORIES((await Api.get(url)).data);
                    logger.debug({
                        context: "useFetchCategories.fetchCategories",
                        list: Abridgers.LIST(props.list),
                        categories: Abridgers.CATEGORIES(theCategories),
                        url: url,
                    });
                } else {
                    logger.debug({
                        context: "useFetchCategories.fetchCategories",
                        msg: "Skipped fetching Categories",
                        url: url,
                    });
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useFetchCategories.fetchCategories", anError, {
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setCategories(theCategories);

        }

        fetchCategories();

    }, [props.active, props.list, props.name,
        props.withItems, props.withList, alertPopup]);


    return {
        error: error ? error : null,
        loading: loading,
        categories: categories,
    }

}

export default useFetchCategories;

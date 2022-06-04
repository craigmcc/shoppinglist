// useMutateCategory ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Category.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessCategory} from "../types";
import Api from "../clients/Api";
import Category, {CATEGORIES_BASE} from "../models/Category";
import List from "../models/List";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean,               // Pop up browser alert on error? [true]
    list: List;                         // Parent List for this Category
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: ProcessCategory;            // Function to insert a new Category
    remove: ProcessCategory;            // Function to remove an existing Category
    update: ProcessCategory;            // Function to update an existing Category
}

// Component Details ---------------------------------------------------------

const useMutateCategory = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateCategory.useEffect",
        });
    });

    const insert: ProcessCategory = async (theCategory) => {

        const url = `${CATEGORIES_BASE}/${props.list.id}`;
        let inserted = new Category();
        setError(null);
        setExecuting(true);

        try {
            inserted = ToModel.CATEGORY((await Api.post(url, theCategory)).data);
            logger.debug({
                context: "useMutateCategory.insert",
                list: Abridgers.LIST(props.list),
                category: Abridgers.CATEGORY(inserted),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateCategory.insert", anError, {
                list: Abridgers.LIST(props.list),
                category: Abridgers.CATEGORY(theCategory),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessCategory = async (theCategory) => {

        const url = `${CATEGORIES_BASE}/${props.list.id}/${theCategory.id}`;
        let removed = new Category();
        setError(null);
        setExecuting(true);

        try {
            removed = ToModel.CATEGORY((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateCategory.remove",
                list: Abridgers.LIST(props.list),
                category: Abridgers.CATEGORY(theCategory),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateCategory.remove", anError, {
                list: Abridgers.LIST(props.list),
                category: Abridgers.CATEGORY(theCategory),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessCategory = async (theCategory) => {

        const url = `${CATEGORIES_BASE}/${props.list.id}/${theCategory.id}`;
        let updated = new Category();
        setError(null);
        setExecuting(true);

        try {
            updated = ToModel.CATEGORY((await Api.put(url, theCategory)).data);
            logger.debug({
                context: "useMutateCategory.update",
                list: Abridgers.LIST(props.list),
                category: Abridgers.CATEGORY(theCategory),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateCategory.update", anError, {
                list: Abridgers.LIST(props.list),
                category: Abridgers.CATEGORY(theCategory),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return updated;

    }

    return {
        error: error,
        executing: executing,
        insert: insert,
        remove: remove,
        update: update,
    };

}

export default useMutateCategory;

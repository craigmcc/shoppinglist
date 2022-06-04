// useMutateItem -------------------------------------------------------------

// Custom hook to encapsulate mutation operations on an Item.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessItem} from "../types";
import Api from "../clients/Api";
import Item, {ITEMS_BASE} from "../models/Item";
import List from "../models/List";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean,               // Pop up browser alert on error? [true]
    list: List;                         // Parent List for this Item
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: ProcessItem;                // Function to insert a new Item
    remove: ProcessItem;                // Function to remove an existing Item
    update: ProcessItem;                // Function to update an existing Item
}

// Component Details ---------------------------------------------------------

const useMutateItem = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateItem.useEffect",
        });
    });

    const insert: ProcessItem = async (theItem) => {

        const url = `${ITEMS_BASE}/${props.list.id}`;
        let inserted = new Item();
        setError(null);
        setExecuting(true);

        try {
            inserted = ToModel.ITEM((await Api.post(url, theItem)).data);
            logger.debug({
                context: "useMutateItem.insert",
                list: Abridgers.LIST(props.list),
                item: Abridgers.ITEM(inserted),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateItem.insert", anError, {
                list: Abridgers.LIST(props.list),
                item: Abridgers.ITEM(theItem),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessItem = async (theItem) => {

        const url = `${ITEMS_BASE}/${props.list.id}/${theItem.id}`;
        let removed = new Item();
        setError(null);
        setExecuting(true);

        try {
            removed = ToModel.ITEM((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateItem.remove",
                list: Abridgers.LIST(props.list),
                item: Abridgers.ITEM(theItem),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateItem.remove", anError, {
                list: Abridgers.LIST(props.list),
                item: Abridgers.ITEM(theItem),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessItem = async (theItem) => {

        const url = `${ITEMS_BASE}/${props.list.id}/${theItem.id}`;
        let updated = new Item();
        setError(null);
        setExecuting(true);

        try {
            updated = ToModel.ITEM((await Api.put(url, theItem)).data);
            logger.debug({
                context: "useMutateItem.update",
                list: Abridgers.LIST(props.list),
                item: Abridgers.ITEM(theItem),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateItem.update", anError, {
                list: Abridgers.LIST(props.list),
                item: Abridgers.ITEM(theItem),
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

export default useMutateItem;

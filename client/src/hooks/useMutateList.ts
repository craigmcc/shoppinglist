// useMutateList ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a List.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import useLocalStorage from "./useLocalStorage";
import {LOGIN_DATA_KEY, LOGIN_USER_KEY} from "../constants";
import {LoginData, ProcessList} from "../types";
import Api from "../clients/Api";
import List, {LISTS_BASE} from "../models/List";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";
import User, {USERS_BASE} from "../models/User";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    clear: ProcessList;                 // Function to clear selected and checked flags
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: ProcessList;                // Function to insert a new List
    remove: ProcessList;                // Function to remove an existing List
    update: ProcessList;                // Function to update an existing List
}

// Component Details ---------------------------------------------------------

const useMutateList = (props: Props = {}): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);
    const [user] = useLocalStorage<User>(LOGIN_USER_KEY);

    useEffect(() => {
        logger.debug({
            context: "useMutateList.useEffect",
            loggedIn: data.loggedIn,
            username: data.username,
        });
    }, [data.loggedIn, data.username]);

    const clear: ProcessList = async (theList) => {

        setError(null);
        setExecuting(true);

        let cleared = new List();
        const url = LISTS_BASE + `/${theList.id}/clear`;

        try {
            cleared = ToModel.LIST((await Api.post(url)).data);
            logger.debug({
                context: "useMutateList.clear",
                url,
                list: Abridgers.LIST(cleared),
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useMutateList.clear", e, {
                url: url,
                list: theList,
            }, alertPopup);
        }

        setExecuting(false);
        return cleared;

    }

    const insert: ProcessList = async (theList) => {

        setError(null);
        setExecuting(true);

        let inserted = new List();
        let url = USERS_BASE
            + `/${user.id}/lists`;
        if (theList.populate) {
            url += "?populate";
        }

        try {
            inserted = ToModel.LIST((await Api.post(url, theList)).data);
            logger.debug({
                context: "useMutateList.insert",
                url: url,
                list: Abridgers.LIST(inserted),
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useMutateList.insert", e, {
                url: url,
                list: theList,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessList = async (theList) => {

        setError(null);
        setExecuting(true);

        let removed = new List();
        const url = LISTS_BASE + `/${theList.id}`;

        try {
            removed = ToModel.LIST((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateList.remove",
                url: url,
                list: Abridgers.LIST(removed),
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useMutateList.remove", e, {
                url: url,
                list: theList,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessList = async (theList) => {

        setError(null);
        setExecuting(true);

        let updated = new List();
        const url = LISTS_BASE + `/${theList.id}`;

        try {
            updated = ToModel.LIST((await Api.put(url, theList)).data);
            logger.debug({
                context: "useMutateList.update",
                url: url,
                list: Abridgers.LIST(updated),
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useMutateList.update", e, {
                url: url,
                list: theList,
            }, alertPopup);
        }

        setExecuting(false);
        return updated;

    }

    return {
        clear: clear,
        error: error,
        executing: executing,
        insert: insert,
        remove: remove,
        update: update,
    };

}

export default useMutateList;

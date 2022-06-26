// useMutateList ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a List.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessList, ProcessShare} from "../types";
import Api from "../clients/Api";
import LoginContext from "../components/login/LoginContext";
import List, {LISTS_BASE} from "../models/List";
import Share from "../models/Share";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";
import {USERS_BASE} from "../models/User";

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
    share: ProcessShare;                // Function to share an existing List
    update: ProcessList;                // Function to update an existing List
}

// Component Details ---------------------------------------------------------

const useMutateList = (props: Props = {}): State => {

    const loginContext = useContext(LoginContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateList.useEffect",
            loggedIn: loginContext.data.loggedIn,
            username: loginContext.data.username,
        });
    }, [loginContext.data.loggedIn, loginContext.data.username]);

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
            + `/${loginContext.user.id}/lists`;
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

    const share: ProcessShare = async (theShare) => {

        setError(null);
        setExecuting(true);

        let output = new Share();
        const url = LISTS_BASE + `/${theShare.listId}/share`;

        try {
            output = ToModel.SHARE((await Api.post(url, theShare)).data);
            logger.debug({
                context: "useMutateList.share",
                url: url,
                share: output,
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useMutateList.share", e, {
                url: url,
                share: theShare,
            }, alertPopup);
        }

        setExecuting(false);
        return output;

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
        share: share,
        update: update,
    };

}

export default useMutateList;

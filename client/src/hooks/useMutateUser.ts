// useMutateUser -------------------------------------------------------------

// Custom hook to encapsulate mutation operations on a User.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessUser} from "../types";
import Api from "../clients/Api";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    insert: ProcessUser;                // Function to insert a new User
    remove: ProcessUser;                // Function to remove an existing User
    update: ProcessUser;                // Function to update an existing User
}

// Component Details ---------------------------------------------------------

const useMutateUser = (props: Props = {}): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateUser.useEffect",
        });
    });

    const insert: ProcessUser = async (theUser) => {

        setError(null);
        setExecuting(true);

        let inserted = new User();
        const url = USERS_BASE;

        try {
            inserted = ToModel.USER((await Api.post(url, theUser)).data);
            logger.debug({
                context: "useMutateUser.insert",
                url: url,
                user: Abridgers.USER(inserted),
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useMutateUser.insert", e, {
                url: url,
                user: {
                    ...theUser,
                    password: "*REDACTED*",
                }
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessUser = async (theUser) => {

        setError(null);
        setExecuting(true);

        let removed = new User();
        const url = USERS_BASE + `/${theUser.id}`;

        try {
            removed = ToModel.USER((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateUser.remove",
                url: url,
                user: Abridgers.USER(removed),
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useMutateUser.remove", e, {
                url: url,
                user: {
                    ...theUser,
                    password: theUser.password ? "*REDACTED*" : null,
                }
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessUser = async (theUser) => {

        setError(null);
        setExecuting(true);

        let updated = new User();
        const url = USERS_BASE + `/${theUser.id}`;

        try {
            updated = ToModel.USER((await Api.put(url, theUser)).data);
            logger.debug({
                context: "useMutateUser.update",
                url: url,
                user: Abridgers.USER(updated),
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useMutateUser.update", e, {
                url: url,
                user: {
                    ...theUser,
                    password: theUser.password ? "*REDACTED*" : null,
                }
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

export default useMutateUser;

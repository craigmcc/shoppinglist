// useFetchLists -------------------------------------------------------------

// Custom hook to fetch List objets that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import LoginContext from "../components/login/LoginContext";
import List from "../models/List";
import {USERS_BASE} from "../models/User";
import {HandleAction} from "../types";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Lists? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    listId?: string;                    // Select list with this id [no filter]
    name?: string;                      // Select Lists with matching names [no filter]
    withCategories?: boolean;           // Include configured Categories? [false]
    withItems?: boolean;                // Include configured Items? [false]
    withUsers?: boolean;                // Include owning Users? [false]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    lists: List[];                      // Fetched Lists
    loading: boolean;                   // Are we currently loading?
    refresh: HandleAction;              // Trigger a refresh
}

// Hook Details --------------------------------------------------------------

const useFetchLists = (props: Props): State => {

    // We use this because we must be sensitive to loggedIn state changes
    const loginContext = useContext(LoginContext);

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {

        const fetchLists = async () => {

            setError(null);
            setLoading(true);
            let theLists: List[] = [];

            const parameters = {
                active: props.active ? "" : undefined,
                listId: props.listId ? props.listId : undefined,
                name: props.name ? props.name : undefined,
                withCategories: props.withCategories ? "" : undefined,
                withItems: props.withItems ? "" : undefined,
                withUsers: props.withUsers ? "" : undefined,
            }
            const url = USERS_BASE
                + `/${loginContext.user.id}/lists${queryParameters(parameters)}`;

            try {
                if (loginContext.data.loggedIn && loginContext.user.id) {
                    theLists = ToModel.LISTS((await Api.get(url)).data);
                    logger.info({
                        context: "useFetchLists.fetchLists",
                        refresh: refresh,
                        url: url,
                        lists: Abridgers.LISTS(theLists),
                    });
                } else {
                    logger.info({
                        context: "useFetchLists.fetchLists",
                        msg: "Skipped fetching Lists",
                        loggedIn: loginContext.data.loggedIn,
                        refresh: refresh,
                        user: Abridgers.USER(loginContext.user),
                        url: url,
                    })
                }
            } catch (e) {
                setError(e as Error);
                ReportError("useFetchLists.fetchLists", e, {
                    loggedIn: loginContext.data.loggedIn,
                    user: Abridgers.USER(loginContext.user),
                    url: url,
                }, alertPopup);
            }

            setLists(theLists);
            setLoading(false);
            setRefresh(false);

        }

        fetchLists();

    }, [alertPopup, refresh,
        loginContext.data.loggedIn,loginContext.user,
        props.active, props.listId, props.name,
        props.withCategories, props.withItems, props.withUsers])

    const handleRefresh: HandleAction = () => {
        setRefresh(true);
    }

    return {
        error: error ? error : null,
        lists: lists,
        loading: loading,
        refresh: handleRefresh,
    }

}

export default useFetchLists;

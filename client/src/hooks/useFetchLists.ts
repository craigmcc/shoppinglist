// useFetchLists -------------------------------------------------------------

// Custom hook to fetch List objets that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import useLocalStorage from "./useLocalStorage";
import Api from "../clients/Api";
import {LOGIN_DATA_KEY, LOGIN_USER_KEY} from "../constants";
import List from "../models/List";
import User, {USERS_BASE} from "../models/User";
import {LoginData} from "../types";
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
}

// Hook Details --------------------------------------------------------------

const useFetchLists = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY);
    const [error, setError] = useState<Error | null>(null);
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [user] = useLocalStorage<User>(LOGIN_USER_KEY);

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
                + `/${user.id}/lists${queryParameters(parameters)}`;

            try {
                if (data.loggedIn && user.id) {
                    theLists = ToModel.LISTS((await Api.get(url)).data);
                    logger.debug({
                        context: "useFetchLists.fetchLists",
                        url: url,
                        lists: Abridgers.LISTS(theLists),
                    });
                } else {
                    logger.info({
                        context: "useFetchLists.fetchLists",
                        msg: "Skipped fetching Lists",
                        loggedIn: data.loggedIn,
                        user: Abridgers.USER(user),
                        url: url,
                    })
                }
            } catch (e) {
                setError(e as Error);
                ReportError("useFetchLists.fetchLists", e, {
                    loggedIn: data.loggedIn,
                    user: Abridgers.USER(user),
                    url: url,
                }, alertPopup);
            }

            setLists(theLists);
            setLoading(false);

        }

        fetchLists();

    }, [alertPopup, data, user,
        props.active, props.listId, props.name,
        props.withCategories, props.withItems, props.withUsers])

    return {
        error: error ? error : null,
        lists: lists,
        loading: loading,
    }

}

export default useFetchLists;

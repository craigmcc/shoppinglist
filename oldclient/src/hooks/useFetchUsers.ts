// useFetchUsers -------------------------------------------------------------

// Custom hook to fetch User objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import User, {USERS_BASE} from "../models/User";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    active?: boolean;                   // Select only active Users? [false]
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    currentPage?: number;               // One-relative current page number [1]
    pageSize?: number;                  // Number of entries per page [25]
    username?: string;                  // Select Users matching pattern [none]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    users: User[];                      // Fetched Users
}

// Hook Details --------------------------------------------------------------

const useFetchUsers = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {

        const fetchUsers = async () => {

            setError(null);
            setLoading(true);
            let theUsers: User[] = [];

            const limit = props.pageSize ? props.pageSize : 25;
            const offset = props.currentPage ? (limit * (props.currentPage - 1)) : 0;
            const parameters = {
                active: props.active ? "" : undefined,
                limit: limit,
                offset: offset,
                username: props.username ? props.username : undefined,
            };
            const url = USERS_BASE
                + `${queryParameters(parameters)}`;

            try {
                theUsers = ToModel.USERS((await Api.get(url)).data);
                logger.debug({
                    context: "useFetchUsers.fetchUsers",
                    url: url,
                    users: Abridgers.USERS(theUsers),
                });

            } catch (e) {
                setError(e as Error);
                ReportError("useFetchUsers.fetchUsers", e, {
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setUsers(theUsers);

        }

        fetchUsers();

    }, [props.active, props.currentPage, props.pageSize, props.username,
        alertPopup]);

    return {
        error: error ? error : null,
        loading: loading,
        users: users,
    };

}

export default useFetchUsers;

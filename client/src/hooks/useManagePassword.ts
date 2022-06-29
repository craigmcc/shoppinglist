// useManagePassword ---------------------------------------------------------

// Custom hook to manage an individual Password and corresponding submit.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandlePassword} from "../types";
import Api from "../clients/Api";
import Password, {PASSWORDS_BASE} from "../models/Password";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    passwordId?: string;                // Optional ID of Password to retrieve at initialization
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    loading: boolean;                   // Are we currently loading?
    password: Password;                 // Password retrieved at initialization (if any)
    submit: HandlePassword;             // Function to submit a reset
    update: HandlePassword;             // Function to submit an update
}

// Hook Details --------------------------------------------------------------

const useManagePassword = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<Password>(new Password());

    useEffect(() => {

        const fetchPassword = async () => {

            setError(null);
            setExecuting(false);
            setLoading(true);
            let thePassword: Password = new Password();
            const url = `${PASSWORDS_BASE}/${props.passwordId}`;

            try {
                if (props.passwordId) {
                    thePassword = ToModel.PASSWORD((await Api.get(url)).data);
                    logger.debug({
                        context: "useManagePassword.fetchPassword",
                        password: thePassword,
                        url: url,
                    });
                } else {
                    logger.debug({
                        context: "useManagePassword.fetchPassword",
                        msg: "Skipped fetching Password",
                    });
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useManagePassword.fetchPassword", anError, {
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setPassword(thePassword);

        }

        fetchPassword();

    }, [props.passwordId, alertPopup]);

    /**
     * Update the password for the current User
     *
     * @param thePassword               New password and reCAPTCHA token
     */
    const update: HandlePassword = async (thePassword) => {

        const url = `${PASSWORDS_BASE}`;
        setError(null);
        setExecuting(true);

        try {
            await Api.post(url, thePassword);
            logger.debug({
                context: "useManagePassword.update",
                password: {
                    ...thePassword,
                    password1: "*REDACTED*",
                    password2: "*REDACTED*",
                }
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useManagePassword.update", anError, {
                url: url,
            });
        }

        setExecuting(false);

    }

    const submit: HandlePassword = async (thePassword) => {

        const url = `${PASSWORDS_BASE}/${props.passwordId}`;
        let password = new Password();
        setError(null);
        setExecuting(true);

        try {
            password = ToModel.PASSWORD((await Api.post(url, thePassword)).data);
            logger.debug({
                context: "useManagePassword.submit",
                password: password,
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useManagePassword.submit", anError, {
                password: thePassword,
                url: url,
            });
        }

    }

    return {
        error: error ? error : null,
        executing: executing,
        loading: loading,
        password: password,
        submit: submit,
        update: update,
    }

}

export default useManagePassword;

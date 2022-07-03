// useManageShare ------------------------------------------------------------

// Custom hook to manage an individual Share and corresponding acceptance.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {HandleShare, ProcessShare} from "../types";
import Api from "../clients/Api";
import Share, {SHARES_BASE} from "../models/Share";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
    shareId?: string;                   // Optional ID of Share to retrieve at initialization
}

export interface State {
    accept: HandleShare;                // Function to send "accept" request
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    loading: boolean;                   // Are we currently loading?
    offer: ProcessShare;                // Offer a Share to another User
    share?: Share;                      // Share retrieved at initalization (if any)
}

// Hook Details --------------------------------------------------------------

const useManageShare = (props: Props): State => {

    const [alertPopup] = useState<boolean>((props.alertPopup !== undefined) ? props.alertPopup : true);
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [share, setShare] = useState<Share>(new Share());

    useEffect(() => {

        const fetchShare = async () => {

            setError(null);
            setExecuting(false);
            setLoading(true);
            let theShare: Share = new Share();
            const url = `${SHARES_BASE}/${props.shareId}`;

            try {
                if (props.shareId) {
                    theShare = ToModel.SHARE((await Api.get(url)).data);
                    logger.debug({
                        context: "useManageShare.fetchShare",
                        share: theShare,
                        url: url,
                    });
                } else {
                    logger.debug({
                        context: "useManageShare.fetchShare",
                        msg: "Skipped fetching Share",
                    });
                }
            } catch (anError) {
                setError(anError as Error);
                ReportError("useManageShare.fetchShare", anError, {
                    url: url,
                }, alertPopup);
            }

            setLoading(false);
            setShare(theShare);

        }

        fetchShare();

    }, [props.shareId, alertPopup]);

    const accept: HandleShare = async (theShare) => {

        const url = `${SHARES_BASE}/${props.shareId}`;
        let shared = new Share();
        setError(null);
        setExecuting(true);

        try {
            shared = ToModel.SHARE((await Api.post(url, theShare)).data);
            logger.debug({
                context: "useManageShare.accept",
                share: shared,
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useManageShare.accept", anError, {
                share: theShare,
                url: url,
            });
        }

    }

    const offer: ProcessShare = async (theShare) => {

        setError(null);
        setExecuting(true);

        let output = new Share();
        const url = SHARES_BASE + `/${theShare.listId}/offer`;

        try {
            output = ToModel.SHARE((await Api.post(url, theShare)).data);
            logger.debug({
                context: "useManageShare.offer",
                url: url,
                share: output,
            });
        } catch (e) {
            setError(e as Error);
            ReportError("useManageShare.offer", e, {
                url: url,
                share: theShare,
            }, alertPopup);
        }

        setExecuting(false);
        return output;

    }

    return {
        accept: accept,
        error: error ? error : null,
        executing: executing,
        loading: loading,
        offer: offer,
        share: share,
    }

}

export default useManageShare;

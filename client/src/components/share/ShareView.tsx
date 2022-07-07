// ShareView -----------------------------------------------------------------

// Supports requesting a share of the currently selected List.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {MutatingProgress} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import ShareForm from "./ShareForm";
import ShareHeader from "./ShareHeader";
import {CURRENT_LIST_KEY} from "../../constants";
import {HandleShare} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import useManageShare from "../../hooks/useManageShare";
import List from "../../models/List";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ShareView = (props: Props) => {

    const [list] = useLocalStorage<List>(CURRENT_LIST_KEY);

    const manageShare = useManageShare({
        alertPopup: true,
    });
    const navigate = useNavigate();

    useEffect(() => {
        logger.debug({
            context: "ShareView.useEffect",
            list: list,
        });
    }, [list]);

    const handleSave: HandleShare = async (theShare) => {
        try {
            const shared = await manageShare.offer(theShare);
            logger.debug({
                context: "ShareView.handleSave",
                share: shared,
            });
            alert("Share invite email has been sent!");
        } catch (error) {
            ReportError("ShareView.handleSave", error, {
                share: theShare,
            });
        }
        navigate("/");
    }

    return (
        <>
            <MutatingProgress
                error={manageShare.error}
                executing={manageShare.executing}
                message="Sending the Share invite email"
            />
            <ShareHeader list={list}/>
            <ShareForm
                autoFocus
                handleSave={handleSave}
                list={list}
            />
        </>
    )

}

export default ShareView;

// AcceptView ----------------------------------------------------------------

// Supports requesting acceptance of a Share invite.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {useNavigate, useParams} from "react-router-dom";
import {MutatingProgress} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import AcceptForm from "./AcceptForm";
import AcceptHeader from "./AcceptHeader";
import {HandleShare} from "../../types";
import useManageShare from "../../hooks/useManageShare";
import Share from "../../models/Share";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const AcceptView = (props: Props) => {

    const [expired, setExpired] = useState<boolean>(false);
    const {shareId} = useParams();

    const manageShare = useManageShare({
        alertPopup: true,
        shareId: shareId,
    });
    const navigate = useNavigate();

    useEffect(() => {
        let theExpired = false;
        if (manageShare.share) {
            theExpired = new Date(manageShare.share.expires) < new Date();
        }
        logger.debug({
            context: "AcceptView.useEffect",
            shareId: shareId,
            share: manageShare.share,
            expired: theExpired,
        });
        setExpired(theExpired);
    }, [shareId, manageShare.share]);

    const handleAccept: HandleShare = async (theShare) => {
        try {
            logger.debug({
                context: "AcceptView.handleAccept",
                share: theShare,
            });
            await manageShare.accept(theShare);
        } catch (error) {
            ReportError("AcceptView.handleAccept", error, {
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
                message="Accepting the Share invite email"
            />
            <AcceptHeader share={manageShare.share ? manageShare.share : new Share()}/>
            {expired ? (
                <Container className="text-center">
                    <span>This Share expired at {manageShare.share?.expires}</span>
                </Container>
            ) : (
                <AcceptForm
                    autoFocus
                    handleAccept={handleAccept}
                    share={manageShare.share ? manageShare.share : new Share()}
                />
            )}

        </>
    )

}

export default AcceptView;

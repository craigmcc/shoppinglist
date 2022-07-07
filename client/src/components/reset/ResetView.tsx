// ResetView -----------------------------------------------------------------

// Supports requesting a password reset email.

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import ResetForm from "./ResetForm";
import ResetHeader from "./ResetHeader";
import {LOGIN_DATA_KEY} from "../../constants";
import {HandleValue, LoginData} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import useManagePassword from "../../hooks/useManagePassword";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ResetView = (props: Props) => {

    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY);

    const managePassword = useManagePassword({
        alertPopup: true,
    });
    const navigate = useNavigate();

    const handleEmail: HandleValue = async (theEmail) => {
        try {
            logger.debug({
                context: "ResetView.handleEmail",
                email: theEmail,
            });
            await managePassword.reset(theEmail);
            alert("Reset Password email has been sent!");
        } catch (error) {
            ReportError("ResetView.handleEmail", error, {
                email: theEmail,
            });
        }
        navigate("/");
    }

    return (
        <>
            <ResetHeader/>
            {!data.loggedIn ? (
                <ResetForm
                    autoFocus
                    handleEmail={handleEmail}
                />
            ) : (
                <Container className="text-center">
                    <span>You must be logged out to use this function</span>
                </Container>
            )}
        </>
    )

}

export default ResetView;

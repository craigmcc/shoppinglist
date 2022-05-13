// MobileView ----------------------------------------------------------------

// Mobile page view.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import MobileLoggedInSubview from "./MobileLoggedInSubview";
import MobileLoggedOutSubview from "./MobileLoggedOutSubview";
import LoginContext from "../login/LoginContext";
import {HandleAction} from "../../types";
import OAuth from "../../clients/OAuth";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Component Details ---------------------------------------------------------

enum View {
    LOGGED_OUT = "Logged Out",
    LOGGED_IN = "Logged In",
}

const MobileView = () => {

    const loginContext = useContext(LoginContext);

    const [view, setView] = useState<View>
        (loginContext.data.loggedIn ? View.LOGGED_IN : View.LOGGED_OUT);

    useEffect(() => {
        logger.info({
            context: "MobileView.useEffect",
            username: loginContext.data.username,
            loggedIn: loginContext.data.loggedIn,
            view: view.toString(),
        });
        if (!loginContext.data.loggedIn) {
            setView(View.LOGGED_OUT);
        }
    }, [loginContext.data.username, loginContext.data.loggedIn, view]);

    const handleCreateAccount: HandleAction = () => {
        alert("handleCreateAccount is not yet implemented");
    }

    const handleForgotPassword: HandleAction = () => {
        alert("handleForgotPassword is not yet implemented");
    }

    const handleLoggedIn: HandleAction = () => {
        setView(View.LOGGED_IN);
    }

    const handleLoggedOut: HandleAction = async () => {
        const accessToken = loginContext.data.accessToken;
        const username = loginContext.data.username;
        try {
            logger.info({
                context: "LoggedInUser.handleLogout",
                username: username,
            })
            await loginContext.handleLogout();
            if (accessToken) {
                await OAuth.delete("/token", {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
            }
        } catch (error) {
            ReportError("LoggedInUser.handleLogout", error, {
                username: username,
            });
        }
        setView(View.LOGGED_OUT);
    }

    return (
        <Container fluid id="MobileView">

            {(view === View.LOGGED_IN) ? (
                <MobileLoggedInSubview
                    handleLoggedOut={handleLoggedOut}
                />
            ) : null }

            {(view === View.LOGGED_OUT) ? (
                <MobileLoggedOutSubview
                    handleCreateAccount={handleCreateAccount}
                    handleForgotPassword={handleForgotPassword}
                    handleLoggedIn={handleLoggedIn}
                />
            ) : null }

        </Container>
    )

}

export default MobileView;

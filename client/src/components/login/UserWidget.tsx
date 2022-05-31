// UserWidget ----------------------------------------------------------------

// Widget for headers to show current user and options (if logged in) or a
// "please login" message (if logged out).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Outlet} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoginContext from "./LoginContext";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

function UserWidget(props: Props) {

    enum Mode {
        LOGGED_IN = "Logged In",
        LOGGED_OUT = "Logged Out",
    }

    const loginContext = useContext(LoginContext);

    const [mode, setMode] = useState<Mode>(Mode.LOGGED_OUT);

    useEffect(() => {
        const theMode: Mode =
            (loginContext.data.loggedIn) ? Mode.LOGGED_IN : Mode.LOGGED_OUT;
        logger.info({
            context: "UserWidget.useEffect",
            mode: theMode.toString(),
        });
        setMode(theMode);
    }, [loginContext.data.loggedIn, Mode]);

    return (
        <>
            <Container>

                {(mode === Mode.LOGGED_IN) ? (
                    <span className="align-middle">Welcome {loginContext.user.firstName}</span>
                    // TODO - options dropdown
                ) : null }

                {(mode === Mode.LOGGED_OUT) ? (
                    <span className="align-middle">Please log in or register.</span>
                ) : null }

            </Container>
            <Outlet/>
        </>
    )

}

export default UserWidget;

// HomeView ------------------------------------------------------------------

// Render the login dialog and options.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect} from "react";
import Container from "react-bootstrap/Container";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import HomeHeader from "./HomeHeader";
import HomeLogin from "./HomeLogin";
import LoginContext from "../login/LoginContext";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

function HomeView(props: Props) {

    const loginContext = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        logger.debug({
            context: "HomeView.useEffect",
            loggedIn: loginContext.data.loggedIn,
        });
        if (loginContext.data.loggedIn) {
            navigate("/lists");
        }
    }, [loginContext.data.loggedIn, navigate]);

    return (
        <Container>
            <HomeHeader/>
            <HomeLogin/>
        </Container>
    )

}

export default HomeView;

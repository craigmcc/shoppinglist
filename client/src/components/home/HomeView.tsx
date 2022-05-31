// HomeView ------------------------------------------------------------------

// Component for the initial (home) view:
// * If logged out, present login dialog and options.
// * If logged in, present list of user's available lists.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import HomeHeader from "./HomeHeader";
import LoginContext from "../login/LoginContext";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

function HomeView(props: Props) {

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
            context: "HomeView.useEffect",
            mode: theMode.toString(),
        });
        setMode(theMode);
    }, [loginContext.data.loggedIn, Mode]);

    return (
        <>
            <HomeHeader/>

            <Container>
                {(mode === Mode.LOGGED_IN) ? (
                    <Row><Col>
                        <span>TODO - logged in content</span>
                    </Col></Row>
                ) : null }

                {(mode === Mode.LOGGED_OUT) ? (
                    <Row><Col>
                        <span>TODO - logged out content</span>
                    </Col></Row>
                ) : null }
            </Container>


        </>
    )

}

export default HomeView;

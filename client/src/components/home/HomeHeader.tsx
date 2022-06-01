// HomeHeader ----------------------------------------------------------------

// Header banner for HomeView.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {CardChecklist} from "react-bootstrap-icons";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import UserWidget from "../login/UserWidget";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

function HomeHeader(props: Props) {

    const loginContext = useContext(LoginContext);

    useEffect(() => {
        logger.debug({
            context: "HomeHeader.useEffect",
            loggedIn: loginContext.data.loggedIn,
        })
    }, [loginContext.data.loggedIn]);

    return (
        <>
            <Container className="bg-light sticky-top mb-3" >
                <Row>
                    <Col className="text-start">
                        <CardChecklist className="align-middle" size={48}/>
                    </Col>
                    <Col className="text-center">
                        {(loginContext.data.loggedIn) ? (
                            <span className="align-middle"><strong>My Shopping Lists</strong></span>
                        ) : (
                            <span className="align-middle"><strong>Welcome to the Shopping Lists App</strong></span>
                        )}
                    </Col>
                    <Col className="text-end">
                        <UserWidget/>
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export default HomeHeader;

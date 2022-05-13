// MobileLoggedInSubview -----------------------------------------------------

// Subview displayed after the user has successfully logged in.

// External Modules ----------------------------------------------------------

import React, {useContext} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {HandleAction} from "../../types";
// import logger from "../../util/ClientLogger";
// import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleLoggedOut: HandleAction;      // Handle a successful logout
}

// Component Details ---------------------------------------------------------

const MobileLoggedInSubview = (props: Props) => {

    const loginContext = useContext(LoginContext);

    return (
        <Container fluid id="MobileLoggedInSubview">

            <Row className="mt-2">
                <Col className="text-left">
                    <strong>
                        <span>Welcome&nbsp;</span>
                        <span className="text-info">{loginContext.data.username?.toUpperCase()}</span>
                        <span>&nbsp;!</span>
                    </strong>
                </Col>
                <Col className="text-end">
                    <Button
                        onClick={props.handleLoggedOut}
                        size="sm"
                        type="button"
                        variant="primary"
                    >Log Out</Button>
                </Col>
            </Row>

        </Container>
    )

}

export default MobileLoggedInSubview;

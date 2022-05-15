// MobileLoggedInSubview -----------------------------------------------------

// Subview displayed after the user has successfully logged in.

// External Modules ----------------------------------------------------------

import React, {useContext, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import MobileListSubview from "./MobileListSubview";
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

    enum View {
        CONTENT = "Content",
        ITEM = "Item",
        LIST = "List",
    }

    const loginContext = useContext(LoginContext);

    const [view/*, setView */] = useState<View>(View.LIST);

    return (
        <Container fluid id="MobileLoggedInSubview">

            <Row className="mt-2 mb-3">
                <Col className="text-left">
                    <strong>
                        <span>Welcome&nbsp;</span>
                        <span className="text-info">{loginContext.user.firstName}</span>
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

            <Row>
                <hr/>
            </Row>

            {(view === View.LIST) ? (
                <MobileListSubview/>
            ) : null }

        </Container>
    )

}

export default MobileLoggedInSubview;

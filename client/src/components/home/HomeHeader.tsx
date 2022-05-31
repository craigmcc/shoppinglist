// HomeHeader ----------------------------------------------------------------

// Header banner for HomeView.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import UserWidget from "../login/UserWidget";
import {CardChecklist} from "react-bootstrap-icons";
import {Outlet} from "react-router-dom";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

function HomeHeader(props: Props) {

    return (
        <>
            <Container className="bg-light sticky-top mb-3" >
                <Row>
                    <Col className="text-start">
                        <CardChecklist className="align-middle" size={48}/>
                    </Col>
                    <Col className="text-center">
                        <span className="align-middle"><strong>My Shopping Lists</strong></span>
                    </Col>
                    <Col className="text-end">
                        <UserWidget/>
                    </Col>
                </Row>
            </Container>
            <Outlet/>
        </>
    )

}

export default HomeHeader;

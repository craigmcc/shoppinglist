// ResetHeader ------------------------------------------------------------

// Header banner for ResetView.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {CaretLeftSquare} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import UserWidget from "../login/UserWidget";
import {HandleAction} from "../../types";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ResetHeader = (props: Props) => {

    const navigate = useNavigate();

    const handleBack: HandleAction = () => {
        navigate("/");
    }

    return (
        <>
            <Container className="bg-light sticky-top mb-3">
                <Row>
                    <Col className="text-start my-1">
                        <CaretLeftSquare
                            className="align-middle"
                            onClick={handleBack}
                            size={48}/>
                    </Col>
                    <Col className="text-center">
                        <span>Request Password Reset Email</span>
                    </Col>
                    <Col className="text-end">
                        <UserWidget/>
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export default ResetHeader;

// ShareHeader ----------------------------------------------------------------

// Header banner for ShareView.

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
import List from "../../models/List";

// Incoming Properties -------------------------------------------------------

export interface Props {
    list: List;                         // List being shared
}

// Component Details ---------------------------------------------------------

const ShareHeader = (props: Props) => {

    const navigate = useNavigate();

    const handleBack: HandleAction = () => {
        navigate("/");
    }

    return (
        <Container className="bg-light sticky-top mb-3">
            <Row>
                <Col className="text-start my-1">
                    <CaretLeftSquare
                        className="align-middle"
                        onClick={handleBack}
                        size={48}/>
                </Col>
                <Col className="text-center">
                        <span className="align-middle"><strong>
                            <span>Share List&nbsp;</span>
                            <span className="text-info">{props.list.name}</span>
                        </strong></span>
                </Col>
                <Col className="text-end">
                    <UserWidget/>
                </Col>
            </Row>
        </Container>
    );

}

export default ShareHeader;

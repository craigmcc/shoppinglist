// AcceptHeader --------------------------------------------------------------

// Header banner for AcceptView.

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
import Share from "../../models/Share";

// Incoming Properties -------------------------------------------------------

export interface Props {
    share: Share;                       // Share being accepted (id=null for new)
}

// Component Details ---------------------------------------------------------

const AcceptHeader = (props: Props) => {

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
                            {props.share.list ? (
                                <>
                                    <span>Accept Invite for List&nbsp;</span>
                                    <span className="text-info">
                                        {props.share.list.name}
                                    </span>
                                </>
                            ) : (
                                <span>ERROR: No List Name Specified</span>
                            )}
                        </strong></span>
                </Col>
                <Col className="text-end">
                    <UserWidget/>
                </Col>
            </Row>
        </Container>
    );

}

export default AcceptHeader;

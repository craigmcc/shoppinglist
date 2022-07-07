// ListsHeader ---------------------------------------------------------------

// Header banner for ListsView.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {CardChecklist} from "react-bootstrap-icons";

// Internal Modules ----------------------------------------------------------

import {LOGIN_DATA_KEY} from "../../constants";
import {LoginData} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import UserWidget from "../login/UserWidget";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

function ListsHeader(props: Props) {

    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY);

    useEffect(() => {
        logger.debug({
            context: "ListsHeader.useEffect",
            loggedIn: data.loggedIn,
        })
    }, [data.loggedIn]);

    return (
        <>
            <Container className="bg-light sticky-top mb-3" >
                <Row>
                    <Col className="text-start">
                        <CardChecklist className="align-middle" size={48}/>
                    </Col>
                    <Col className="text-center">
                        <span className="align-middle">
                            <strong>My Shopping Lists</strong>
                        </span>
                    </Col>
                    <Col className="text-end">
                        <UserWidget/>
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export default ListsHeader;

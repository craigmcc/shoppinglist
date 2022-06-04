// CategoriesHeader ----------------------------------------------------------

// Header banner for CategoriesView.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {CaretLeftSquare} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import UserWidget from "../login/UserWidget";
import {CURRENT_LIST_KEY} from "../../constants";
import {HandleAction} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import List from "../../models/List";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const CategoriesHeader = (props: Props) => {

    const [list] = useLocalStorage<List>(CURRENT_LIST_KEY);
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
                            Manage Categories for&nbsp;
                            <span className="text-info">
                                {list.name}
                            </span>
                        </strong></span>
                </Col>
                <Col className="text-end">
                    <UserWidget/>
                </Col>
            </Row>
        </Container>
    )

}

export default CategoriesHeader;

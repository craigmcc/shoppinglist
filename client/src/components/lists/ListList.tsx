// ListList ------------------------------------------------------------------

// List Lists that are associated with the currently logged in User.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {HandleAction, HandleList} from "../../types";
import useFetchLists from "../../hooks/useFetchLists";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a List [not allowed]
    handleEdit?: HandleList;            // Handle request to edit a List [not allowed]
    handleSelect: HandleList;           // Handle request to select a List
    handleShare?: HandleList;           // Handle request to share a List
}

// Component Details ---------------------------------------------------------

const ListList = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const fetchLists = useFetchLists({
        alertPopup: false,
    });

    useEffect(() => {

        logger.debug({
            context: "ListList.useEffect",
            user: Abridgers.USER(loginContext.user),
        });

    }, [loginContext.data.loggedIn, loginContext.user]);

    const handleAdd: HandleAction = () => {
        if (props.handleAdd) {
            props.handleAdd();
        }
    }

    const handleEdit: HandleList = (theList) => {
        if (props.handleEdit) {
            props.handleEdit(theList);
        }
    }

    const handleSelect: HandleList = (theList) => {
        props.handleSelect(theList);
    }

    const handleShare: HandleList = (theList) => {
        if (props.handleShare) {
            props.handleShare(theList);
        }
    }

    // TODO - somewhere we need an Add button.
    return (
        <Container fluid id="ListList">

            <Row className="mb-3">
                <Col className="text-center">
{/*
                    <span>Click on a List to begin adding Items, or click&nbsp;</span>
                    <span className="text-info">Add</span>
                    <span>&nbsp;or&nbsp;</span>
                    <span className="text-info">Edit</span>
                    <span>&nbsp;to manage your Lists</span>
*/}
                    <span><strong>Manage Lists</strong></span>
                </Col>
                <Col className="text-end">
                    <Button
                        disabled={!props.handleAdd}
                        onClick={handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>
                </Col>
            </Row>

            <Row className="mb-3">
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">List Name</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchLists.lists.map((list) => (
                        <tr
                            className="table-default"
                            key={`LL-${list.id}`}
                        >
                            <td onClick={(() => handleSelect(list))}>
                                {list.name}
                            </td>
                            <td onClick={(() => handleSelect(list))}>
                                {list.notes}
                            </td>
                            <td>
                                {(props.handleEdit) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleEdit(list)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Edit</Button>
                                ) : null }
                                {(props.handleShare) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShare(list)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Share</Button>
                                ) : null }
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>

    )

}

export default ListList;

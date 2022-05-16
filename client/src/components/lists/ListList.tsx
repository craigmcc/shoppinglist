// ListList ------------------------------------------------------------------

// List Lists that are associated with the currently logged in User.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import {Plus, ThreeDots} from "react-bootstrap-icons";

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
        } else {
            alert("You are not allowed to add a new List");
        }
    }

    const handleEdit: HandleList = (theList) => {
        if (props.handleEdit) {
            props.handleEdit(theList);
        } else {
            alert("You are not allowed to edit an existing List");
        }
    }

    const handleSelect: HandleList = (theList) => {
        props.handleSelect(theList);
    }

    const handleShare: HandleList = (theList) => {
        if (props.handleShare) {
            props.handleShare(theList);
        } else {
            alert("You are not allowed to share an existing List");
        }
    }

    return (
        <>

            <Row className="mb-3">
                <Col className="text-left">
                    <span><strong>My Lists</strong></span>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="success"
                    >
                        <Plus
                            onClick={handleAdd}
                            size={32}
                        />
                    </Button>
                </Col>
            </Row>
            <Row>
                <hr style={{border: "double"}}/>
            </Row>

            {fetchLists.lists.map((list) => (
                <>
                <Row className="mb-2" key={`LL-${list.id}`}>
                    <Col className="col-9 text-start" onClick={() => handleSelect(list)}>
                        {(list.active) ? (
                            <p>{list.name}</p>
                        ) : (
                            <p><del>{list.name}</del></p>
                        )}
                        {(list.notes) ? (
                            <p className="fw-lighter"><small>&nbsp;&nbsp;&nbsp;&nbsp;{list.notes}</small></p>
                        ) : null }
                    </Col>
                    <Col className="text-end">
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-primary">
                                <ThreeDots size={16}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => {handleEdit(list)}}>
                                    Edit
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => {handleShare(list)}}>
                                    Share
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row>
                    <hr/>
                </Row>
                </>
            ))}

        </>

    )

}

export default ListList;

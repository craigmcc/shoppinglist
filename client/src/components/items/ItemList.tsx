// ItemList --------------------------------------------------------------

// List Items for the specified List.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import {ArrowUp, Plus, ThreeDots} from "react-bootstrap-icons";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleItem} from "../../types";
import useFetchItems from "../../hooks/useFetchItems";
import Category from "../../models/Category";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    category?: Category;                // Optional parent Category for these items
    handleAdd?: HandleAction;           // Handle request to add an Item [not allowed]
    handleEdit?: HandleItem;            // Handle request to edit an Item [not allowed]
    handleReturn: HandleAction;         // Handle return to parent subview
    list: List;                         // Parent List for these Items
}

// Component Details ---------------------------------------------------------

const ItemList = (props: Props) => {

    const fetchItems = useFetchItems({
        alertPopup: false,
        category: props.category ? props.category : undefined,
        list: props.list,
    });

    useEffect(() => {
        logger.info({
            context: "ItemList.useEffect",
            category: props.category ? Abridgers.CATEGORY(props.category) : undefined,
            list: Abridgers.LIST(props.list),
        });
    }, [props.category, props.list]);

    const handleAdd: HandleAction = () => {
        if (props.handleAdd) {
            props.handleAdd();
        } else {
            alert("You are not allowed to add a new Item");
        }
    }

    const handleEdit: HandleItem = (theItem) => {
        if (props.handleEdit) {
            props.handleEdit(theItem);
        } else {
            alert("You are not allowed to edit an existing Item");
        }
    }

    return (
        <>

            <Row className="mb-3">
                <Col className="text-start">
                    <strong>
                        <span>Items </span>
                        {(props.category) ? (
                            <>
                                <span>for </span>
                                <span className="text-info">{props.category.name}</span>
                            </>
                        ) : null }
                        <span> in </span>
                        <span className="text-info">{props.list.name}</span>
                    </strong>
                </Col>
                <Col className="text-end">
                    <Button
                        onClick={handleAdd}
                        size="sm"
                        variant="success"
                    >
                        <Plus size={32}/>
                    </Button>
                    &nbsp;
                    <Button
                        onClick={props.handleReturn}
                        size="sm"
                        variant="secondary"
                    >
                        <ArrowUp size={32}
                        />
                    </Button>
                </Col>
            </Row>
            <Row>
                <hr style={{border: "double"}}/>
            </Row>

            {fetchItems.items.map((item) => (
                <>
                    <Row className="mb-2" key={`LL-${item.id}`}>
                        <Col className="col-9 text-start">
                            {(item.active) ? (
                                <p style={{marginBottom: "0.1rem"}}>{item.name}</p>
                            ) : (
                                <p style={{marginBottom: "0.1rem"}}><del>{item.name}</del></p>
                            )}
                            {(item.notes) ? (
                                <p className="fw-lighter" style={{marginBottom: "0.1rem"}}>
                                    <small>&nbsp;&nbsp;&nbsp;&nbsp;{item.notes}</small>
                                </p>
                            ) : null }
                        </Col>
                        <Col className="text-end">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary">
                                    <ThreeDots size={16}/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => {handleEdit(item)}}>
                                        Edit
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

export default ItemList;

// CategoryList --------------------------------------------------------------

// List Categories for the specified List.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import {ArrowUp, Plus, ThreeDots} from "react-bootstrap-icons";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleCategory} from "../../types";
import useFetchCategories from "../../hooks/useFetchCategories";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Category [not allowed]
    handleEdit?: HandleCategory;        // Handle request to edit a Category [not allowed]
    handleReturn: HandleAction;         // Handle return to parent subview
    handleSelect?: HandleCategory;      // Handle request to select a Category [not allowed]
    list: List;                         // Parent List for these Categories
}

// Component Details ---------------------------------------------------------

const CategoryList = (props: Props) => {

    const fetchCategories = useFetchCategories({
        alertPopup: false,
        list: props.list,
    });

    useEffect(() => {
        logger.debug({
            context: "CategoryList.useEffect",
            list: Abridgers.LIST(props.list),
        });
    }, [props.list]);

    const handleAdd: HandleAction = () => {
        if (props.handleAdd) {
            props.handleAdd();
        } else {
            alert("You are not allowed to add a new Category");
        }
    }

    const handleEdit: HandleCategory = (theCategory) => {
        if (props.handleEdit) {
            props.handleEdit(theCategory);
        } else {
            alert("You are not allowed to edit an existing Category");
        }
    }

    const handleSelect: HandleCategory = (theCategory) => {
        if (props.handleSelect) {
            props.handleSelect(theCategory);
        }
    }

    return (
        <>

            <Row className="mb-3">
                <Col className="text-start">
                    <strong>
                        <span>Categories for </span>
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

            {fetchCategories.categories.map((category) => (
                <>
                    <Row className="mb-2" key={`LL-${category.id}`}>
                        <Col className="col-9 text-start" onClick={() => handleSelect(category)}>
                            {(category.active) ? (
                                <p style={{marginBottom: "0.1rem"}}>{category.name}</p>
                            ) : (
                                <p style={{marginBottom: "0.1rem"}}><del>{category.name}</del></p>
                            )}
                            {(category.notes) ? (
                                <p className="fw-lighter" style={{marginBottom: "0.1rem"}}>
                                    <small>&nbsp;&nbsp;&nbsp;&nbsp;{category.notes}</small>
                                </p>
                            ) : null }
                        </Col>
                        <Col className="text-end">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary">
                                    <ThreeDots size={16}/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => {handleEdit(category)}}>
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

export default CategoryList;

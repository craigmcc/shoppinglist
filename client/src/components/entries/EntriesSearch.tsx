// EntriesSearch -------------------------------------------------------------

// Top row controls for EntriesList.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {SearchBar} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleItem, HandleValue} from "../../types";
import useFetchItems from "../../hooks/useFetchItems";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {PlusCircleFill, ThreeDots} from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd: HandleAction;            // Handle request to add a new Item
    handleClear: HandleAction;          // Handle request to clear selected Items
    handleSelect: HandleItem;           // Handle request to select an Item
    list: List;                         // List for which to select an Item
}

// Component Details ---------------------------------------------------------

const MISMATCH_NAME = "WILL NOT MATCH ANYTHING";

const EntriesSearch = (props: Props) => {

    const [name, setName] = useState<string>("");
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const fetchItems = useFetchItems({
        alertPopup: true,
        list: props.list,
        name: (name.length > 0) ? name : MISMATCH_NAME,
        withCategory: true,
    });

    useEffect(() => {
        logger.debug({
            context: "EntriesSearch.useEffect",
            list: Abridgers.LIST(props.list),
            name: (name.length > 0) ? name : undefined,
        });
    }, [props.list, name]);

    // Handle request to add a new Item instead of select an existing Item
    const handleAdd: HandleAction = () => {
        logger.debug({
            context: "EntriesSearch.handleAdd",
        });
        setName("");
        props.handleAdd();
    }

    // Handle change in the Item name value to search for
    const handleChange: HandleValue = (value) => {
        logger.debug({
            context: "EntriesSearch.handleChange",
            value: value,
        });
        setName(value);
    }

    // Handle request to clear selected Items
    const handleClear: HandleAction = () => {
        setShowConfirm(true);
    }

    // Handle request to clear selected Items that has been confirmed
    const handleClearConfirmed: HandleAction = () => {
        logger.debug({
            context: "EntriesSearch.handleClearConfirmed",
        });
        setName("");
        setShowConfirm(false);
        props.handleClear();
    }

    // Handle request to deny clear confirmation
    const handleClearDenied: HandleAction = () => {
        setShowConfirm(false);
    }

    // Handle request to refresh selected Items
    const handleRefresh: HandleAction = () => {
        logger.debug({
            context: "EntriesSearch.handleRefresh",
        });
        fetchItems.handleRefresh();
    }

    // Handle request to select this Item
    const handleSelect: HandleItem = (item) => {
        logger.debug({
            context: "EntriesSearch.handleSelect",
            item: Abridgers.ITEM(item),
        });
        setName("");
        props.handleSelect(item);
    }

    return (
        <>
        <Container>

            <Row className="mb-3">
                <Col>
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        name="itemName"
                        placeholder="Item name to add"
                        value={name}
                    />
                </Col>
                <Col className="text-center">
                    <PlusCircleFill
                        color="primary"
                        onClick={handleAdd}
                        size={48}
                    />
                </Col>
                <Col className="text-end">
                    <Dropdown>
                        <Dropdown.Toggle
                            className="px-0"
                            variant="success-outline"
                        >
                            <ThreeDots size={16}/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={handleRefresh}
                            >Refresh Entries</Dropdown.Item>
                            <Dropdown.Divider/>
                            <Dropdown.Item
                                onClick={handleClear}
                            >Clear Entries</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            {(name.length > 0) ? (
                <Row className="mb-3">
                    <Table hover size="sm">
                        <thead>
                        <tr className="bg-warning">
                            <th className="text-center" colSpan={2}>
                                Matching Items
                            </th>
                        </tr>
                        <tr className="bg-warning">
                            <th className="text-center">
                                Item Name
                            </th>
                            <th className="text-center">
                                Category Name
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {fetchItems.items.map(item => (
                            <tr key={`S-${item.id}`}>
                                <td
                                    className="text-start"
                                    onClick={() => handleSelect(item)}
                                >
                                    {item.name}
                                </td>
                                <td
                                    className="text-start"
                                    onClick={() => handleSelect(item)}
                                >
                                    {item.categoryName}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Row>
            ) : null }

        </Container>

            {/* Clear Entries Confirmation */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="bg-warning"
                onHide={handleClearDenied}
                show={showConfirm}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Clear Selected Items List?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        This action will remove all selected Items for this List.
                        Please confirm that this is what you wish to do by
                        clicking the Yes button below.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        autoFocus
                        onClick={handleClearDenied}
                        size="sm"
                        type="button"
                        variant="primary"
                    >No</Button>
                    <Button
                        autoFocus
                        onClick={handleClearConfirmed}
                        size="sm"
                        type="button"
                        variant="warning"
                    >Yes</Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default EntriesSearch;

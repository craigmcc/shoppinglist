// EntriesList ---------------------------------------------------------------

// Manage currently selected Items for the current List.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {Pencil, PlusCircleFill, ThreeDots} from "react-bootstrap-icons";
import {SearchBar} from "@craigmcc/shared-react"

// Internal Modules ----------------------------------------------------------

import {CURRENT_LIST_KEY} from "../../constants";
import {HandleAction, HandleItem, HandleValue} from "../../types";
import useFetchItems from "../../hooks/useFetchItems";
import useMutateItem from "../../hooks/useMutateItem";
import useLocalStorage from "../../hooks/useLocalStorage";
import Item from "../../models/Item";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import * as Sorters from "../../util/Sorters";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const EntriesList = (props: Props) => {

    const [categoryItems, setCategoryItems] = useState<Item[][]>([]);
    const [categoryNames, setCategoryNames] = useState<string[]>([]);
    const [list] = useLocalStorage<List>(CURRENT_LIST_KEY);

    const fetchItems = useFetchItems({
        alertPopup: true,
        list: list,
        selected: true,
        withCategory: true,
        withList: false,
    });
    const mutateItem = useMutateItem({
        alertPopup: true,
        list: list,
    });

    useEffect(() => {

        logger.debug({
            context: "EntriesList.useEffect",
            list: Abridgers.LIST(list),
            items: Abridgers.ITEMS(fetchItems.items),
        });

        // Sort, categorize, and save the selected Items
        let theItems: Item[] = Sorters.ITEMS(fetchItems.items);
        const theCategoryNames: string[] = [];
        const theCategoryItems: Item[][] = [];
        let currentCategoryName: string = "";
        let currentCategoryItems: Item[] = [];
        theItems.forEach(theItem => {
            if (theItem.categoryName !== currentCategoryName) {
                if (currentCategoryName !== "") {
                    theCategoryNames.push(currentCategoryName);
                    theCategoryItems.push(currentCategoryItems);
                }
                currentCategoryName = theItem.categoryName as string;
                currentCategoryItems = [];
            }
            currentCategoryItems.push(theItem);
        });
        if (currentCategoryName !== "") {
            theCategoryNames.push(currentCategoryName);
            theCategoryItems.push(currentCategoryItems);
        }
        setCategoryNames(theCategoryNames);
        setCategoryItems(theCategoryItems);

    }, [list, fetchItems.items]);

    // Handle adding a new Item and then selecting it
    const handleAdd: HandleAction = () => {
        logger.info({
            context: "EntriesList.handleAdd",
        });
        // TODO - handle adding and selecting a new Item
    }

    // Handle checking or unchecking a selected Item
    const handleChecked: HandleItem = (item) => {
        logger.info({
            context: "EntriesList.handleChecked",
            old: item.checked,
            new: !item.checked,
        });
        item.checked = !item.checked;
        // TODO - mutate this Item in the database
    }

    // Handle clearing all selections
    const handleClear: HandleAction = () => {
        logger.info({
            context: "EntriesList.handleClear",
        });
        // TODO - clear all selected flags
    }

    // Handle request to edit a note on an Item
    const handleEdit: HandleItem = (item) => {
        logger.info({
            context: "EntriesList.handleEdit",
            item: item,
        });
        // TODO - handleEdit
    }

    // Handle a character by character change in the search criteria
    const handleSearchChange: HandleValue = (value) => {
        logger.info({
            context: "EntriesList.handleSearchChange",
            value: value,
        });
        // TODO - handleSearchChange
    }

    const handleSearchValue: HandleValue = (value) => {
        logger.info({
            context: "EntriesList.handleSearchValue",
            value: value,
        });
        // TODO - handleSearchValue
    }

    // Handle selecting or unselecting an Item
    const handleSelected: HandleItem = (item) => {
        logger.info({
            context: "EntriesList.handleSelected",
            old: item.selected,
            new: !item.selected,
        });
        item.selected = !item.selected;
        // TODO - mutate this Item in the database
    }

    // TODO - top row controls probably need their own component and/or modal?
    // TODO - fancier list with category names interspersed
    return (
        <Container>
            <Row className="mb-3">
                <Col className="col-8">
                    <SearchBar
                        autoFocus
                        handleChange={handleSearchChange}
                        handleValue={handleSearchValue}
                        htmlSize={50}
                        name="itemName"
                        placeholder="Item Name"
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
                                onClick={handleClear}
                            >Clear Entries</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <Row className="mb-3">
                <Table hover size="sm">
                    <tbody>
                    {categoryNames.map((categoryName, index) => (
                        <>
                        <tr key={`C-${categoryName}`}>
                            <td
                                className="text-center bg-info"
                                colSpan={2}
                            >
                                <strong>{categoryName}</strong>
                            </td>
                        </tr>
                            {categoryItems[index].map(categoryItem => (
                                <tr key={`I-${categoryItem.id}`}>
                                    <td
                                        className="text-start"
                                        onClick={() => handleChecked(categoryItem)}
                                    >
                                        {!categoryItem.checked ? (
                                            <span>{categoryItem.name}</span>
                                        ) : (
                                            <span><del>{categoryItem.name}</del></span>
                                        )}
                                        {categoryItem.notes ? (
                                            <p><small>&nbsp;&nbsp;{categoryItem.notes}</small></p>
                                        ) : null }
                                    </td>
                                    <td
                                        className="text-end"
                                        onClick={() => handleEdit(categoryItem)}
                                    >
                                        <Pencil className="me-2" size={16}/>
                                    </td>
                                </tr>
                            ))}
                        </>
                    ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    )

}

export default EntriesList;

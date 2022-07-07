// ListsList -----------------------------------------------------------------

// List of available Lists for the currently logged in User.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {PlusCircleFill, ThreeDots} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {CURRENT_LIST_KEY} from "../../constants";
import {HandleAction, HandleList} from "../../types";
import useFetchLists from "../../hooks/useFetchLists";
import useLocalStorage from "../../hooks/useLocalStorage";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ListsList = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const [list, setList] = useLocalStorage<List>(CURRENT_LIST_KEY);

    const fetchLists = useFetchLists({
        alertPopup: false,
        withCategories: false,
        withItems: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        logger.info({
            context: "ListsList.useEffect",
            list: Abridgers.LIST(list),
            lists: Abridgers.LISTS(fetchLists.lists),
        });
    }, [list, fetchLists.lists]);

    // Handle a request to add a new List
    const handleAdd: HandleAction = () => {
        logger.debug({
            context: "ListsList.handleAdd",
        });
        setList(new List());
        navigate("/list");
    }

    // Select a List for which its Categories will be managed
    const handleCategories: HandleList = (list) => {
        logger.debug({
            context: "ListsList.handleCategories",
            list: Abridgers.LIST(list),
        });
        setList(list);
        navigate("/categories");
    }

    // Select a List for which its current contents will be managed
    const handleEdit: HandleList = (list) => {
        logger.debug({
            context: "ListsList.handleEdit",
            list: list,
        });
        setList(list);
        navigate("/list");
    }

    // Select a List for which its Items will be managed
    const handleItems: HandleList = (list) => {
        logger.debug({
            context: "ListsList.handleItems",
            list: Abridgers.LIST(list),
        });
        setList(list);
        navigate("/items");
    }

    // Select a List for which its current entries will be managed
    const handleSelect: HandleList = (list) => {
        logger.debug({
            context: "ListsList.handleSelect",
            list: Abridgers.LIST(list),
        });
        setList(list);
        navigate("/entries");
    }

    // Select a List which will be offered to be shared with another User
    const handleShare: HandleList = (list) => {
        logger.debug({
            context: "ListsList.handleShare",
            list: Abridgers.LIST(list),
        });
        setList(list);
        navigate("/share");
    }

    return (
        <Container>
            <Row className="mb-3">
                <Table
                    hover
                    size="sm"
                >
                    <tbody>
                    {fetchLists.lists.map(list => (
                        <tr key={`L-${list.id}`}>
                            <td
                                className="text-start"
                                onClick={() => handleSelect(list)}
                            >
                                {list.active ? (
                                    <span>{list.name}</span>
                                ) : (
                                    <span><del>{list.name}</del></span>
                                )}
                                {list.notes ? (
                                    <p><small>&nbsp;&nbsp;{list.notes}</small></p>
                                ) : null}
                            </td>
                            <td className="text-end">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        className="px-0"
                                        variant="success-outline"
                                    >
                                        <ThreeDots size={16}/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => handleEdit(list)}
                                        >Edit Settings</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleCategories(list)}
                                        >Manage Categories</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleItems(list)}
                                        >Manage Items</Dropdown.Item>
                                        <Dropdown.Divider/>
                                        <Dropdown.Item
                                            disabled={!loginContext.validateAdmin(list)}
                                            onClick={(() => handleShare(list))}
                                        >Share List</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Row>
            <Row>
                <Col className="text-center">
                    <PlusCircleFill
                        color="primary"
                        onClick={handleAdd}
                        size={48}
                    />
                </Col>
            </Row>
        </Container>
    )

}

export default ListsList;

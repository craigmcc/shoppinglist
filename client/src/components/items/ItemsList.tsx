// ItemsList ------------------------------------------------------------

// List the Items associated with the currently selected List.

// External Modules ----------------------------------------------------------

import {useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {PlusCircleFill, ThreeDots} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import {CURRENT_ITEM_KEY, CURRENT_LIST_KEY} from "../../constants";
import {HandleAction, HandleItem} from "../../types";
import useFetchItems from "../../hooks/useFetchItems";
import useLocalStorage from "../../hooks/useLocalStorage";
import Item from "../../models/Item";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
}

// Component Details --------------------------------------------------------

const ItemsList = (props: Props) => {

    const [item, setItem] = useLocalStorage<Item>(CURRENT_ITEM_KEY);
    const [list] = useLocalStorage<List>(CURRENT_LIST_KEY);

    const fetchItems = useFetchItems({
        alertPopup: false,
        list: list,
        withCategory: true,
        withList: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        logger.debug({
            context: "ItemsList.useEffect",
            list: Abridgers.LIST(list),
            item: item,
            items: Abridgers.CATEGORIES(fetchItems.items),
        });
    }, [item, list, fetchItems.items]);

    const handleAdd: HandleAction = () => {
        logger.debug({
            context: "ItemsList.handleAdd",
        });
        setItem({
            listId: list.id,
        });
        navigate("/item");
    }

    const handleEdit: HandleItem = (item) => {
        logger.debug({
            context: "ItemsList.handleEit",
            item: Abridgers.ITEM(item),
        });
        setItem(item);
        navigate("/item");
    }

    return (
        <Container>
            <Row className="mb-3">
                <Table
                    hover
                    size="sm"
                >
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category Name</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {fetchItems.items.map(item => (
                        <tr key={`C-{item.id}`}>
                            <td className="text-start">
                                {item.active ? (
                                    <span>{item.name}</span>
                                ) : (
                                    <span><del>{item.name}</del></span>
                                )}
                                {item.notes ? (
                                    <p><small>&nbsp;&nbsp;{item.notes}</small></p>
                                ) : null }
                            </td>
                            <td className={"text-start"}>
                                {item.category?.name}
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
                                            onClick={() => handleEdit(item)}
                                        >Edit Settings</Dropdown.Item>
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

export default ItemsList;

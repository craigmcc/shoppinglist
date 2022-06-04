// HomeLists -----------------------------------------------------------------

// List the authorized List(s) for the currently logged in User.

// External Modules ----------------------------------------------------------

import {useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {PlusCircleFill, ThreeDots} from "react-bootstrap-icons";
import {Outlet, useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

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

const HomeLists = (props: Props) => {

    const [list, setList] = useLocalStorage(CURRENT_LIST_KEY);

    const fetchLists = useFetchLists({
        alertPopup: false,
        withCategories: false,
        withItems: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        logger.debug({
            context: "HomeLists.useEffect",
            list: Abridgers.LIST(list),
            lists: Abridgers.LISTS(fetchLists.lists),
        });
    }, [list, fetchLists.lists]);

    const handleAdd: HandleAction = () => {
        logger.debug({
            context: "HomeLists.handleAdd",
        });
        setList(new List());
        navigate("/list");
    }

    const handleCategories: HandleList = (list) => {
        logger.debug({
            context: "HomeLists.handleCategories",
            list: Abridgers.LIST(list),
        });
        setList(list);
        navigate("/categories");
    }

    const handleEdit: HandleList = (list) => {
        logger.debug({
            context: "HomeLists.handleEdit",
            list: list,
        });
        setList(list);
        navigate("/list");
    }

    const handleItems: HandleList = (list) => {
        alert(`TODO: Manage Items for '${list.name}' is not yet implemented`);
    }

    const handleSelect: HandleList = (list) => {
        alert(`TODO: Select List for '${list.name}' is not yet implemented`);
    }

    const handleShare: HandleList = (list) => {
        alert(`TODO: Share List for '${list.name}' is not yet implemented`);
    }

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Table
                        hover
                        size="sm"
                    >
                        <tbody>
                        {fetchLists.lists.map(list => (
                            <tr key={`L-{list.id}`}>
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
            <Outlet/>
        </>
    )

}

export default HomeLists;

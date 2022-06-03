// HomeLists -----------------------------------------------------------------

// List the authorized List(s) for the currently logged in User.

// External Modules ----------------------------------------------------------

import {/*useContext, */useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {PlusCircleFill, ThreeDots} from "react-bootstrap-icons";
//import {Outlet, useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

//import LoginContext from "../login/LoginContext";
import {HandleAction, HandleList} from "../../types";
import useFetchLists from "../../hooks/useFetchLists";
//import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
//import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const HomeLists = (props: Props) => {

    const fetchLists = useFetchLists({
        alertPopup: false,
        withCategories: false,
        withItems: false,
    });
//    const loginContext = useContext(LoginContext);
//    const navigate = useNavigate();

    useEffect(() => {
        logger.info({
            context: "HomeLists.useEffect",
            lists: Abridgers.LISTS(fetchLists.lists),
        })
    }, [fetchLists.lists]);

    const handleAdd: HandleAction = () => {
        alert("Add List is not yet implemented");
    }

    const handleEdit: HandleList = (list) => {
        alert(`Edit Settings for '${list.name}' is not yet implemented`);
    }

    const handleSelect: HandleList = (list) => {
        alert(`Select List for '${list.name}' is not yet implemented`);
    }

    const handleShare: HandleList = (list) => {
        alert(`Share List for '${list.name}' is not yet implemented`);
    }

    return (
        <>
            <Container>
                <Row>
                    <Table
                        hover
                        size="sm"
                    >
                        <tbody>
                        {fetchLists.lists.map(list => (
                            <tr>
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
                <Row className="mt-2">
                    <Col className="text-center">
                        <PlusCircleFill
                            color="primary"
                            onClick={handleAdd}
                            size={48}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )

}

export default HomeLists;

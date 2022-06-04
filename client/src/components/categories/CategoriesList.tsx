// CategoriesList ------------------------------------------------------------

// List the Categories associated with the currently selected List.

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

import {CURRENT_CATEGORY_KEY, CURRENT_LIST_KEY} from "../../constants";
import {HandleAction, HandleCategory} from "../../types";
import useFetchCategories from "../../hooks/useFetchCategories";
import useLocalStorage from "../../hooks/useLocalStorage";
import Category from "../../models/Category";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
}

// Component Details --------------------------------------------------------

const CategoriesList = (props: Props) => {

    const [category, setCategory] = useLocalStorage<Category>(CURRENT_CATEGORY_KEY);
    const [list] = useLocalStorage<List>(CURRENT_LIST_KEY);

    const fetchCategories = useFetchCategories({
        alertPopup: false,
        list: list,
        withItems: false,
        withList: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        logger.debug({
            context: "CategoriesList.useEffect",
            list: Abridgers.LIST(list),
            category: category,
            categories: Abridgers.CATEGORIES(fetchCategories.categories),
        });
    }, [category, list, fetchCategories.categories]);

    const handleAdd: HandleAction = () => {
        logger.debug({
            context: "CategoriesList.handleAdd",
        });
        setCategory({
            listId: list.id,
        });
        navigate("/category");
    }

    const handleEdit: HandleCategory = (category) => {
        logger.debug({
            context: "CategoriesList.handleEit",
            category: Abridgers.CATEGORY(category),
        });
        setCategory(category);
        navigate("/category");
    }

    return (
        <Container>
            <Row className="mb-3">
                <Table
                    hover
                    size="sm"
                >
                    <tbody>
                    {fetchCategories.categories.map(category => (
                        <tr key={`C-{category.id}`}>
                            <td className="text-start">
                                {category.active ? (
                                    <span>{category.name}</span>
                                ) : (
                                    <span><del>{category.name}</del></span>
                                )}
                                {category.notes ? (
                                    <p><small>&nbsp;&nbsp;{category.notes}</small></p>
                                ) : null }
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
                                            onClick={() => handleEdit(category)}
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

export default CategoriesList;

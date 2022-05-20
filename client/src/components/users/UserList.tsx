// UserList ------------------------------------------------------------------

// List Users that match search criteria, offering callbacks for adding,
// editing, and removing Users.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {Plus} from "react-bootstrap-icons";
import {CheckBox, FetchingProgress, Pagination} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {HandleAction, HandleBoolean, HandleUser, Scope} from "../../types";
import useFetchUsers from "../../hooks/useFetchUsers";
import User from "../../models/User";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a User [not allowed]
    handleEdit?: HandleUser;            // Handle request to select a User [not allowed]
}

// Component Details ---------------------------------------------------------

const UserList = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [availables, setAvailables] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);

    const fetchUsers = useFetchUsers({
        active: active,
        alertPopup: false,
        currentPage: currentPage,
        pageSize: pageSize,
    });

    useEffect(() => {

        logger.debug({
            context: "UserList.useEffect",
            active: active,
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        if (isSuperuser) {
            setAvailables(fetchUsers.users);
        } else {
            setAvailables([]);
        }

    }, [loginContext,
        active,
        fetchUsers.users]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleEdit: HandleUser = (theUser) => {
        if (props.handleEdit) {
            props.handleEdit(theUser);
        }
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    return (
        <Container fluid id="UserList">

            <FetchingProgress
                error={fetchUsers.error}
                loading={fetchUsers.loading}
                message="Fetching selected Users"
            />

            <Row className="mb-3 ms-1 me-1">
                <Col className="text-start">
                    <span><strong>Manage Users</strong></span>
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Users Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(availables.length === 0) ||
                            (availables.length < pageSize)}
                        variant="secondary"
                    />
                </Col>
                <Col className="text-end">
                    <Button
                        disabled={!props.handleAdd}
                        onClick={props.handleAdd}
                        size="sm"
                        variant="success"
                    >
                        <Plus size={32}/>
                    </Button>
                </Col>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">Username</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Scope</th>
                    </tr>
                    </thead>

                    <tbody>
                    {availables.map((user, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={props.handleEdit ? (() => handleEdit(user)) : undefined}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {user.username}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {user.firstName}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {user.firstName}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {listValue(user.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {user.scope}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

            <Row className="mb-3 ms-1 me-1">
                <Button
                    disabled={!props.handleAdd}
                    onClick={props.handleAdd}
                    size="sm"
                    variant="success"
                >
                    <Plus size={32}/>
                </Button>
            </Row>

        </Container>
    )

}

export default UserList;

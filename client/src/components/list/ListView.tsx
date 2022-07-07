// ListView ------------------------------------------------------------------

// Supports editing of a new or existing List.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import ListForm from "./ListForm";
import ListHeader from "./ListHeader";
import {CURRENT_LIST_KEY, LOGIN_DATA_KEY} from "../../constants";
import {HandleList, LoginData} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import useMutateList from "../../hooks/useMutateList";
import List from "../../models/List";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ListView = (props: Props) => {

    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY)
    const [list] = useLocalStorage<List>(CURRENT_LIST_KEY);

    const mutateList = useMutateList();
    const navigate = useNavigate();

    useEffect(() => {
        logger.debug({
            context: "ListView.useEffect",
            list: list,
        });
    }, [list]);

    const handleSave: HandleList = async (theList) => {
        // TODO - mutating progress?
        try {
            let saved: List;
            if (theList.id) {
                saved = await mutateList.update(theList);
            } else {
                saved = await mutateList.insert(theList);
            }
            logger.debug({
                context: "ListView.handleSave",
                list: saved,
            });
        } catch (error) {
            ReportError("ListView.handleSave", error, {
                list: theList,
            });
        }
        navigate("/");
    }

    return (
        <>
            {(list) ? (
                <>
                    <ListHeader list={list}/>
                    <Container>
                        {data.loggedIn ? (
                            <ListForm
                                autoFocus
                                handleSave={handleSave}
                                list={list}
                            />
                        ) : (
                            <Row>
                                <Col className="text-center">
                                    <span className="text-danger"><strong>
                                        You must be logged in to perform this task.
                                    </strong></span>
                                </Col>
                            </Row>
                        )}
                    </Container>
                </>
            ) : null }

        </>
    )

}

export default ListView;

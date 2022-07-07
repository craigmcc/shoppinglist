// ListsView -----------------------------------------------------------------

// Show the available lists for the currently logged in User.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import Container from "react-bootstrap/Container";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import ListsHeader from "./ListsHeader";
import ListsList from "./ListsList";
import {LOGIN_DATA_KEY} from "../../constants";
import {LoginData} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ListsView = (props: Props) => {

    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY);

    const navigate = useNavigate();

    useEffect(() => {
        logger.debug({
            context: "ListsView.useEffect",
            loggedIn: data.loggedIn,
        });
        if (!data.loggedIn) {
            navigate("/");
        }
    }, [data.loggedIn, navigate])

    return (
        <Container>
            <ListsHeader/>
            <ListsList/>
        </Container>
    )

}

export default ListsView;

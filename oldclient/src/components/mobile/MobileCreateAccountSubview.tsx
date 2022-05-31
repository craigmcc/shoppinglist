// MobileCreateAccountSubview ------------------------------------------------

// Subview displayed to create a new User (and optional first List).

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import CreateAccountForm from "../general/CreateAccountForm";
import {HandleAction, HandleCreateAccount} from "../../types";
import useMutateUser from "../../hooks/useMutateUser";
import CreateAccount from "../../models/CreateAccount";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleBack: HandleAction;           // Handle return from this view
}

// Component Details ---------------------------------------------------------

const MobileCreateAccountSubview = (props: Props) => {

    const mutateUser = useMutateUser({
        alertPopup: false,
    });

    const initialValues = new CreateAccount({
        listName: "My List",
    });

    const handleCreateAccount: HandleCreateAccount = async (createAccount) => {
        logger.debug({
            context: "MobileCreateAccountSubview.handleCreateAccount",
            createAccount: {
                ...createAccount,
                password1: "*REDACTED*",
                password2: "*REDACTED*",
            },
        });
        /*const created = */await mutateUser.create(createAccount);
        props.handleBack();
    }

    return (
        <Container fluid id="MobileCreateAccountSubview">

            <Row className="mt-2">
                <CreateAccountForm
                    autoFocus={true}
                    createAccount={initialValues}
                    handleBack={props.handleBack}
                    handleCreateAccount={handleCreateAccount}
                />
            </Row>

        </Container>
    )

}

export default MobileCreateAccountSubview;

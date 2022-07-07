// RegisterView --------------------------------------------------------------

// Supports requesting creation of a new User and (optional) associated List.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import RegisterForm from "./RegisterForm";
import RegisterHeader from "./RegisterHeader";
import {LOGIN_DATA_KEY} from "../../constants";
import {HandleCreateAccount, LoginData} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import useMutateUser from "../../hooks/useMutateUser";
import CreateAccount from "../../models/CreateAccount";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const RegisterView = (props: Props) => {

    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY);
    const mutateUser = useMutateUser();
    const navigate = useNavigate();

    const EMPTY_CREATE_ACCOUNT: CreateAccount = new CreateAccount({
    });

    const handleCreateAccount: HandleCreateAccount = async (theCreateAccount) => {
        // TODO - mutating progress?
        const redactedCreateAccount: CreateAccount = {
            ...theCreateAccount,
            password1: "*REDACTED*",
            password2: "*REDACTED*",
        }
        try {
            logger.debug({
                context: "RegisterView.handleCreateAccount",
                createAccount: redactedCreateAccount,
            });
            /* const updated = */ await mutateUser.create(theCreateAccount);
        } catch (error) {
            ReportError("RegisterView.handleCreateAccount", error, {
                createAccount: redactedCreateAccount,
            })
        }
        navigate("/");
    }

    return (
        <>
            <RegisterHeader/>

            <Container>
                {!data.loggedIn ? (
                    <RegisterForm
                        autoFocus
                        handleCreateAccount={handleCreateAccount}
                        createAccount={EMPTY_CREATE_ACCOUNT}/>
                ) : (
                    <Row>
                        <Col className="text-center">
                            <span className="text-danger"><strong>
                                You must be logged out to perform this task.
                            </strong></span>
                        </Col>
                    </Row>
                )}
            </Container>

        </>
    )

}

export default RegisterView;

// RegisterView --------------------------------------------------------------

// Supports requesting creation of a new User and (optional) associated List.

// External Modules ----------------------------------------------------------

import React, {useContext} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Outlet, useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import RegisterForm from "./RegisterForm";
import RegisterHeader from "./RegisterHeader";
import LoginContext from "../login/LoginContext";
import {HandleCreateAccount} from "../../types";
import useMutateUser from "../../hooks/useMutateUser";
import CreateAccount from "../../models/CreateAccount";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const RegisterView = (props: Props) => {

    const loginContext = useContext(LoginContext);
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
            logger.info({
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
                {!loginContext.data.loggedIn ? (
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
            <Outlet/>

        </>
    )

}

export default RegisterView;

// MobileLoggedOutSubview ----------------------------------------------------

// Subview displayed when no user is currently logged in.

// External Modules ----------------------------------------------------------

import React, {useContext} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import LoginForm from "../login/LoginForm";
import {HandleAction, HandleCredentials} from "../../types";
import OAuth from "../../clients/OAuth";
import PasswordTokenRequest from "../../models/PasswordTokenRequest";
import TokenResponse from "../../models/TokenResponse";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleCreateAccount: HandleAction;  // Handle request to create an account
    handleForgotPassword: HandleAction; // Handle request to change password
    handleLoggedIn: HandleAction;       // Handle a successful login
}

// Component Details ---------------------------------------------------------

const MobileLoggedOutSubview = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const handleLogin: HandleCredentials = async (credentials) => {
        const tokenRequest: PasswordTokenRequest = {
            grant_type: "password",
            password: credentials.password,
            username: credentials.username,
        }
        try {
            logger.info({
                context: "MobileLoggedOutSubview.handleLogin",
                username: credentials.username,
                password: "*REDACTED*",
            });
            const tokenResponse: TokenResponse =
                (await OAuth.post("/token", tokenRequest)).data;
            loginContext.handleLogin(credentials.username, tokenResponse);
            logger.debug({
                context: "LoggedInUser.handleLogin",
                msg: "Successfully logged in",
                tokenResponse: JSON.stringify(tokenResponse),
            });
            props.handleLoggedIn();
        } catch (error) {
            ReportError("LoggedInUser.handleLogin", error, {
                username: credentials.username,
                password: "*REDACTED*",
            });
        }
    }

    return (
        <Container fluid id="MobileLoggedOutSubview">

            <Row className="mt-2 mb-2">
                <Col className="text-center">
                    <strong>Welcome to My Shopping List!</strong>
                </Col>
            </Row>

            <Row>
                <LoginForm
                    autoFocus={true}
                    handleLogin={handleLogin}
                />
            </Row>

            <Row>
                <Col className="text-start">
                    <span onClick={props.handleCreateAccount}>
                        Create new account
                    </span>
                </Col>
                <Col className="text-end">
                    <span onClick={props.handleForgotPassword}>
                        Forgot my password
                    </span>
                </Col>
            </Row>

        </Container>
    )

}

export default MobileLoggedOutSubview;

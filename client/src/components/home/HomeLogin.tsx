// HomeLogin -----------------------------------------------------------------

// Login form and associated controls.

// External Modules ----------------------------------------------------------

import React, {useContext} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {HandleAction, HandleCredentials} from "../../types";
import LoginForm from "../login/LoginForm";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const HomeLogin = (props: Props) => {

    const loginContext = useContext(LoginContext);
    const navigate = useNavigate();

    const handleForgotPassword: HandleAction = () => {
        logger.debug({
            context: "HomeLogin.handleForgotPassword",
        })
        navigate("/reset");
    }

    const handleLogin: HandleCredentials = async (credentials) => {
        try {
            logger.info({
                context: "HomeLogin.handleLogin",
                username: credentials.username,
                password: "*REDACTED*",
            });
            await loginContext.handleLogin(credentials);
            navigate("/lists");
        } catch (error) {
            ReportError("HomeLogin.handleLogin", error, {
                username: credentials.username,
                password: "*REDACTED*",
            });
        }
    }

    const handleRegister: HandleAction = () => {
        navigate("/register");
    }

    return (
        <Container>
            <Row>
                <Col className="text-center">
                    Please Log In
                </Col>
            </Row>
            <Row>
                <LoginForm
                    autoFocus
                    handleLogin={handleLogin}
                />
            </Row>
            <Row>
                <Col className="text-start">
                    <Button
                        onClick={handleRegister}
                        size="sm"
                        type="button"
                        variant="success"
                    >Register</Button>
                </Col>
                <Col className="text-end">
                    <Button
                        onClick={handleForgotPassword}
                        size="sm"
                        type="button"
                        variant="info"
                    >Forgot My Password</Button>
                </Col>
            </Row>
        </Container>
    )

}

export default HomeLogin;

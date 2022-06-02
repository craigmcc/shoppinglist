// HomeView ------------------------------------------------------------------

// Component for the initial (home) view:
// * If logged out, present login dialog and options.
// * If logged in, present list of user's available lists.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Outlet, useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import HomeHeader from "./HomeHeader";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleCredentials} from "../../types";
import LoginForm from "../login/LoginForm";
import OAuth from "../../clients/OAuth";
import PasswordTokenRequest from "../../models/PasswordTokenRequest";
import TokenResponse from "../../models/TokenResponse";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

function HomeView(props: Props) {

    enum Mode {
        LOGGED_IN = "Logged In",
        LOGGED_OUT = "Logged Out",
    }

    const loginContext = useContext(LoginContext);
    const navigate = useNavigate();

    const [mode, setMode] = useState<Mode>(Mode.LOGGED_OUT);

    useEffect(() => {
        const theMode: Mode =
            (loginContext.data.loggedIn) ? Mode.LOGGED_IN : Mode.LOGGED_OUT;
        logger.debug({
            context: "HomeView.useEffect",
            mode: theMode.toString(),
        });
        setMode(theMode);
    }, [loginContext.data.loggedIn, Mode]);

    const handleForgotPassword: HandleAction = () => {
        alert("handleForgotPassword is not yet implemented.");
    }

    const handleLogin: HandleCredentials = async (credentials) => {
        const tokenRequest: PasswordTokenRequest = {
            grant_type: "password",
            password: credentials.password,
            username: credentials.username,
        }
        try {
            logger.info({
                context: "HomeView.handleLogin",
                username: credentials.username,
                password: "*REDACTED*",
            });
            const tokenResponse: TokenResponse =
                (await OAuth.post("/token", tokenRequest)).data;
            await loginContext.handleLogin(credentials.username, tokenResponse);
        } catch (error) {
            ReportError("HomeView.handleLogin", error, {
                username: credentials.username,
                password: "*REDACTED*",
            });
        }
    }

    const handleRegister: HandleAction = () => {
        navigate("/register");
    }

    return (
        <>
            <HomeHeader/>

            <Container>
                {(mode === Mode.LOGGED_IN) ? (
                    <Row><Col>
                        <span>TODO - logged in content</span>
                    </Col></Row>
                ) : null }

                {(mode === Mode.LOGGED_OUT) ? (
                    <Container className="g-3">
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
                ) : null }
            </Container>

            <Outlet/>

        </>
    )

}

export default HomeView;

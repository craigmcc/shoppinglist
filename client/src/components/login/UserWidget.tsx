// UserWidget ----------------------------------------------------------------

// Widget for headers to show current user and options (if logged in) or a
// "please login" message (if logged out).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import {PersonCircle} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoginContext from "./LoginContext";
import {LOGIN_DATA_KEY} from "../../constants";
import {HandleAction, LoginData} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

function UserWidget(props: Props) {

    enum Mode {
        LOGGED_IN = "Logged In",
        LOGGED_OUT = "Logged Out",
    }

    const [data] = useLocalStorage<LoginData>(LOGIN_DATA_KEY);
    const loginContext = useContext(LoginContext);
    const navigate = useNavigate();

    const [mode, setMode] = useState<Mode>(Mode.LOGGED_OUT);

    useEffect(() => {
        const theMode: Mode =
            (data.loggedIn) ? Mode.LOGGED_IN : Mode.LOGGED_OUT;
        logger.debug({
            context: "UserWidget.useEffect",
            mode: theMode.toString(),
        });
        if (mode !== theMode) {
            setMode(theMode);
        }
    }, [data.loggedIn, mode, Mode.LOGGED_IN, Mode.LOGGED_OUT]);

    const handleLogout = async (): Promise<void> => {
        const username = data.username;
        try {
            await loginContext.handleLogout();
        } catch (error) {
            ReportError("UserWidget.handleLogout", error, {
                username: username,
            });
        }
        navigate("/");
    }

    const handlePassword: HandleAction = () => {
        navigate("/passwords");
    }

    const handleProfile: HandleAction = () => {
        navigate("/profile");
    }

    return (
        <Container className='px-0'>

            {(mode === Mode.LOGGED_IN) ? (
                <>
                    <span className="align-middle">
                        {/*Welcome {loginContext.user.firstName}*/}
                        <Dropdown>
                            <Dropdown.Toggle
                                className="px-0"
                                variant="secondary-outline"
                            >
                                <PersonCircle size={32}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={handleProfile}>Edit Profile</Dropdown.Item>
                                <Dropdown.Item
                                    onClick={handlePassword}>Update Password</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item
                                    onClick={handleLogout}>Log Out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                </>
            ) : null }

            {(mode === Mode.LOGGED_OUT) ? (
                <span className="align-middle">Please Log In or Register.</span>
            ) : null }

        </Container>
    )

}

export default UserWidget;

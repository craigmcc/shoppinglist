// UserWidget ----------------------------------------------------------------

// Widget for headers to show current user and options (if logged in) or a
// "please login" message (if logged out).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import {ThreeDotsVertical} from "react-bootstrap-icons";
import {useNavigate, Outlet} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoginContext from "./LoginContext";
import {HandleAction} from "../../types";
import logger from "../../util/ClientLogger";
import OAuth from "../../clients/OAuth";
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

    const loginContext = useContext(LoginContext);
    const navigate = useNavigate();

    const [mode, setMode] = useState<Mode>(Mode.LOGGED_OUT);

    useEffect(() => {
        const theMode: Mode =
            (loginContext.data.loggedIn) ? Mode.LOGGED_IN : Mode.LOGGED_OUT;
        logger.info({
            context: "UserWidget.useEffect",
            mode: theMode.toString(),
        });
        setMode(theMode);
    }, [loginContext.data.loggedIn, Mode]);

    const handleLogout = async (): Promise<void> => {
        const accessToken = loginContext.data.accessToken;
        const username = loginContext.data.username;
        try {
            logger.info({
                context: "UserWidget.handleLogout",
                username: username,
//                accessToken: accessToken,
            })
            await loginContext.handleLogout();
            navigate("/");
            if (accessToken) {
                await OAuth.delete("/token", {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
            }
        } catch (error) {
            ReportError("UserWidget.handleLogout", error, {
                username: username,
//                accessToken: accessToken,
            });
        }
    }

    const handlePassword: HandleAction = () => {
        alert("User clicked 'Change Password'");
    }

    const handleProfile: HandleAction = () => {
        alert("User clicked 'Edit Profile'");
    }

    return (
        <>
            <Container>

                {(mode === Mode.LOGGED_IN) ? (
                    <>
                    <span className="align-middle">
                        {/*Welcome {loginContext.user.firstName}*/}
                        <Dropdown>
                            <Dropdown.Toggle id="logged-in-actions" variant="secondary">
                                <ThreeDotsVertical size={16}/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handlePassword}>Change Password</Dropdown.Item>
                                <Dropdown.Item onClick={handleProfile}>Edit Profile</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                    </>
                ) : null }

                {(mode === Mode.LOGGED_OUT) ? (
                    <span className="align-middle">Please Log In or Register.</span>
                ) : null }

            </Container>
            <Outlet/>
        </>
    )

}

export default UserWidget;

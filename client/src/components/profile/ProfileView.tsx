// ProfileView ---------------------------------------------------------------

// Supports editing the currently logged in User's profile.

// External Modules ----------------------------------------------------------

import React, {useContext} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Outlet, useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import ProfileForm from "./ProfileForm";
import ProfileHeader from "./ProfileHeader";
import LoginContext from "../login/LoginContext";
import {HandleUser} from "../../types";
import useMutateUser from "../../hooks/useMutateUser";
import User from "../../models/User";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ProfileView = (props: Props) => {

    const loginContext = useContext(LoginContext);
    const mutateUser = useMutateUser();
    const navigate = useNavigate();

    const handleUpdate: HandleUser = async (theUser) => {
        // TODO - mutating progress?
        try {
            const useUser: User = {
                ...loginContext.user,
                // Overwrite only the fields we allow the user to edit
                email: theUser.email,
                firstName: theUser.firstName,
                lastName: theUser.lastName,
            }
            logger.info({
                context: "ProfileView.handleUpdate",
                input: theUser,
                update: useUser,
            });
            /* const updated = */ await mutateUser.update(useUser);
            await loginContext.refreshUser();
        } catch (error) {
            ReportError("ProfileView.handleUpdate", error, {
                user: theUser,
            })
        }
        navigate("/");
    }

    return (
        <>
            <ProfileHeader/>

            <Container>
                {loginContext.data.loggedIn ? (
                    <ProfileForm
                        handleUpdate={handleUpdate}
                        user={loginContext.user}/>
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
            <Outlet/>

        </>
    )

}

export default ProfileView;

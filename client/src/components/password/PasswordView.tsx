// PasswordView --------------------------------------------------------------

// Supports updating (if logged in) or resetting (if not logged in)
// a User's password.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {useNavigate, useParams} from "react-router-dom";
import {MutatingProgress} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import PasswordForm from "./PasswordForm";
import PasswordHeader from "./PasswordHeader";
import LoginContext from "../login/LoginContext";
import {HandlePassword} from "../../types";
import useManagePassword from "../../hooks/useManagePassword";
import Password from "../../models/Password";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const PasswordView = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const [expired, setExpired] = useState<boolean>(false);
    const {passwordId} = useParams();

    const managePassword = useManagePassword({
        alertPopup: true,
        passwordId: passwordId,
    });
    const navigate = useNavigate();

    useEffect(() => {
        let theExpired = false;
        if (managePassword.password.expires) {
            theExpired = new Date(managePassword.password.expires) < new Date();
        }
        logger.info({
            context: "PasswordView.useEffect",
            expired: theExpired,
            password: managePassword.password.expires ? {
                ...managePassword.password,
                password1: "*REDACTED*",
                password2: "*REDACTED*",
            } : undefined,
            user: loginContext.data.loggedIn ? Abridgers.USER(loginContext.user) : undefined,
        });
        setExpired(theExpired);
    }, [loginContext.data.loggedIn, loginContext.user,
            passwordId, managePassword.password]);

    const handlePassword: HandlePassword = async (thePassword) => {
        try {
            logger.debug({
                context: "PasswordView.handlePassword",
                password: {
                    ...thePassword,
                    password1: "*REDACTED*",
                    password2: "*REDACTED*",
                },
                user: loginContext.data.loggedIn ? Abridgers.USER(loginContext.user) : undefined,
            });
            if (loginContext.data.loggedIn) {
                await managePassword.update(thePassword);
            } else {
                alert("Send 'forgot password' email");
            }
        } catch (error) {
            ReportError("PasswordView.handlePassword", error, {
                password: {
                    ...thePassword,
                    password1: "*REDACTED*",
                    password2: "*REDACTED*",
                },
                user: loginContext.data.loggedIn ? Abridgers.USER(loginContext.user) : undefined,
            });
        }
        navigate("/");
    }

    return (
        <>
            <MutatingProgress
                error={managePassword.error}
                executing={managePassword.executing}
                message="Submitting the password change"
            />
            <PasswordHeader/>
            {expired ? (
                <Container className="text-center">
                    <span>This password reset offer has expired</span>
                </Container>
            ) : (
                <PasswordForm
                    autoFocus
                    handlePassword={handlePassword}
                    password={new Password({
                        email: null,
                        password1: null,
                        password2: null,
                    })}
//                    password={managePassword.password ? managePassword.password : new Password()}
                />
            )}
        </>
    )

}

export default PasswordView;

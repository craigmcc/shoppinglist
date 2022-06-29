// PasswordForm --------------------------------------------------------------

// Form for changing your password (if logged in) or resetting it (if forgotten).

// External Modules ----------------------------------------------------------

import React, {useContext, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ReCAPTCHA from "react-google-recaptcha";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {TextField} from "@craigmcc/shared-react";
import {Validators} from "@craigmcc/shared-utils";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {RECAPTCHA_SITE_KEY} from "../../constants";
import {HandlePassword} from "../../types"
import Password from "../../models/Password";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handlePassword: HandlePassword;     // Handle password change/reset request
    password: Password;                 // Password being submitted
}

// Component Details ---------------------------------------------------------

const PasswordForm = (props: Props) => {

    type Values = {
        email: string;
        password1: string;
        password2: string;
    }

    const [autoFocus] = useState<boolean>(props.autoFocus ? props.autoFocus : false);
    const [token, setToken] = useState<string>("");

    const loginContext = useContext(LoginContext);

    const onSubmit: SubmitHandler<Values> = (values) => {
        const thePassword = new Password({
            ...values,
            token: token,
        });
        logger.debug({
            context: "PasswordForm.onSubmit",
            password: thePassword,
        });
        props.handlePassword(thePassword);
    }

    // The reCAPTCHA check was successfully completed
    const onSuccess = (theToken: string | null): void => {
        setToken(theToken ? theToken : "");
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .test("valid-email",
                "Invalid email format",
                function (value) {
                    return Validators.email(value ? value : "");
                })
            .test("email-match",
                "That is not the correct email address for this reset",
                function (value) {
                    if (loginContext.data.loggedIn) {
                        return loginContext.user.email === value;
                    } else {
                        return true;
                    }
                }),
        password1: Yup.string()
            .required("First password is required"),
        password2: Yup.string()
            .required("Second password is required")
            .test("passwords-match",
                "The two password values must match",
                function (this) {
                    return (this.parent.password1 === this.parent.password2);
                }),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<Password>({
        defaultValues: new Password({
            email: (loginContext.data.loggedIn ? loginContext.user.email : null),
            password1: null,
            password2: null,
        }),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="PasswordForm">
            <Form
                id="PasswordFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="emailRow">
                    <TextField
                        autoFocus={!loginContext.data.loggedIn && autoFocus}
                        disabled={loginContext.data.loggedIn}
                        errors={errors}
                        label="Email Address:"
                        name="email"
                        register={register}
                        valid="Your email address."
                    />
                </Row>

                <Row className="mb-3" id="passwordsRow">
                    <TextField
                        autoFocus={loginContext.data.loggedIn && autoFocus}
                        errors={errors}
                        label="Requested Password:"
                        name="password1"
                        register={register}
                        type="password"
                        valid="The password you wish to use."
                    />
                    <TextField
                        errors={errors}
                        label="Repeat Requested Password:"
                        name="password2"
                        register={register}
                        type="password"
                        valid="Repeat the requested password (must match)."
                    />
                </Row>

                <Row className="mb-3">
                    <Col className="text-center">
                        <ReCAPTCHA
                            onChange={onSuccess}
                            sitekey={RECAPTCHA_SITE_KEY}
                            size="normal"
                        />
                    </Col>
                    <Col className="text-center">
                        <Button
                            disabled={token.length === 0}
                            size="sm"
                            type="submit"
                            variant="primary"
                        >
                            {(loginContext.data.loggedIn) ? (
                                <>Update</>
                            ) : (
                                <>Reset</>
                            )}
                        </Button>
                    </Col>
                </Row>

            </Form>
        </Container>
    )

}

export default PasswordForm;

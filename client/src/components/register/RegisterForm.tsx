// RegisterForm --------------------------------------------------------------

// Form for editing a new User's registration information.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ReCAPTCHA from "react-google-recaptcha";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {CheckBoxField, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {RECAPTCHA_SITE_KEY} from "../../constants";
import {HandleCreateAccount} from "../../types";
import CreateAccount from "../../models/CreateAccount";
import {validateUserUsernameUnique} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    createAccount: CreateAccount;       // Initial values
    handleCreateAccount: HandleCreateAccount; // Handle User registration request
}

// Component Details ---------------------------------------------------------

const RegisterForm = (props: Props) => {

    const [token, setToken] = useState<string>("");

    const onSubmit: SubmitHandler<CreateAccount> = (values) => {
        const theCreateAccount = new CreateAccount({
            ...values,
            token: token,
        });
        logger.debug({
            context: "RegisterForm.onSubmit",
            createAccount: theCreateAccount,
        });
        props.handleCreateAccount(theCreateAccount);
    }

    // The reCAPTCHA check was successfully completed
    const onSuccess = (theToken: string | null): void => {
        setToken(theToken ? theToken : "");
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .nullable(),
        firstName: Yup.string()
            .required("First Name is required"),
        lastName: Yup.string()
            .required("Last Name is required"),
        listName: Yup.string()
            .nullable(),
        password1: Yup.string()
            .required(),
        password2: Yup.string()
            .required()
            .test("passwords-match",
                "The two password values must match",
                function (this) {
                    return (this.parent.password1 === this.parent.password2);
                }),
        populate: Yup.boolean()
            .required(),
        username: Yup.string()
            .required()
            .test("unique-username",
                "That username is already in use",
                async function (this) {
                    return validateUserUsernameUnique(ToModel.USER(this.parent))
                }),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<CreateAccount>({
        defaultValues: new CreateAccount(props.createAccount),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="RegisterForm">
            <Form
                id="RegisterFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="firstNameLastNameRow">
                    <TextField
                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                        errors={errors}
                        label="First Name:"
                        name="firstName"
                        register={register}
                        valid="Your first name."
                    />
                    <TextField
                        errors={errors}
                        label="Last Name:"
                        name="lastName"
                        register={register}
                        valid="Your last name."
                    />
                </Row>

                <Row className="mb-3" id="emailUsernameRow">
                    <TextField
                        errors={errors}
                        label="Email Address:"
                        name="email"
                        register={register}
                        valid="Your email address."
                    />
                    <TextField
                        errors={errors}
                        label="Requested Username:"
                        name="username"
                        register={register}
                        valid="Your requested username (must be unique)."
                    />
                </Row>

                <Row className="mb-3" id="passwordsRow">
                    <TextField
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

                <Row className="mb-3" id="listNamePopulateRow">
                    <TextField
                        errors={errors}
                        label="(Optional) Shopping List Name To Create:"
                        name="listName"
                        register={register}
                        valid="The first shopping list to be created for you (if any)."
                    />
                    <CheckBoxField
                        errors={errors}
                        label="Populate with standard Categories and Items?"
                        name="populate"
                        register={register}
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
                            Register
                        </Button>
                    </Col>
                </Row>

            </Form>
        </Container>
    )

}

export default RegisterForm;

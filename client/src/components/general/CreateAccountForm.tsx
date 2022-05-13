// CreateAccountForm ---------------------------------------------------------

// Detail editing form for setting up a new account.

// External Modules ----------------------------------------------------------

import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleCreateAccount} from "../../types";
import CreateAccount from "../../models/CreateAccount";
import {validateUserUsernameUnique} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    createAccount: CreateAccount;       // Initial values
    handleBack: HandleAction;           // Handle return to previous view
    handleCreateAccount: HandleCreateAccount; // Handle request to create account
}

// Component Details ---------------------------------------------------------

const CreateAccountForm = (props: Props) => {

    const onSubmit: SubmitHandler<CreateAccount> = (values) => {
        const createAccount = new CreateAccount({
            ...props.createAccount,
            ...values
        });
        logger.debug({
            context: "CreateAccountForm.onSubmit",
            createAccount: {
                ...createAccount,
                password1: "*REDACTED*",
                password2: "*REDACTED*",
            },
        });
        props.handleCreateAccount(createAccount);
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required"),
        firstName: Yup.string()
            .required("First Name is required"),
        lastName: Yup.string()
            .required("Last Name is required"),
        listName: Yup.string()
            .nullable(),
        password1: Yup.string()
            .required("First password entry is required"),
        password2: Yup.string()
            .required("Second password entry is required")
            .test("password-match",
                "The two passwords must match",
                function(this) {
                    return (this.parent.password1 === this.parent.password2);
                }),
        username: Yup.string()
            .required("Username is required")
            .test("unique-username",
                "That username is already in use",
                async function (this) {
                    return validateUserUsernameUnique(ToModel.USER(this.parent))
                }),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<CreateAccount>({
        defaultValues: props.createAccount,
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="CreateAccountForm">

            <Row className="mb-3">
                <Col className="text-center">
                    <strong>Create Account</strong>
                </Col>
                <Col className="text-end">
                    <Button
                        onClick={() => props.handleBack()}
                        size="sm"
                        type="button"
                        variant="secondary"
                    >Back</Button>
                </Col>
            </Row>

            <Form
                id="CreateAccountFormDetails"
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
                        valid="First Name of this User."
                    />
                    <TextField
                        errors={errors}
                        label="Last Name:"
                        name="lastName"
                        register={register}
                        valid="Last Name of this User."
                    />
                </Row>

                <Row className="mb-3" id="emailUsernameRow">
                    <TextField
                        errors={errors}
                        label="Email Address:"
                        name="email"
                        register={register}
                        valid="Email address of this User."
                    />
                    <TextField
                        errors={errors}
                        label="Username:"
                        name="username"
                        register={register}
                        valid="Requested username (must be unique)."
                    />
                </Row>

                <Row className="mb-3" id="passwordsRow">
                    <TextField
                        errors={errors}
                        label="Password:"
                        name="password1"
                        register={register}
                        type="password"
                        valid="Requested password."
                    />
                    <TextField
                        errors={errors}
                        label="Repeat Password:"
                        name="password2"
                        register={register}
                        valid="Repeat password (must match)."
                    />
                </Row>

                <Row className="mb-3" id="listNameRow">
                    <TextField
                        errors={errors}
                        label="Name of Shopping List to Create:"
                        name="listName"
                        register={register}
                        valid="Leave blank to skip creation."
                    />
                </Row>

                <Row>
                    <Col className="text-center">
                        <Button
                            size="sm"
                            type="submit"
                            variant="primary"
                        >Create</Button>
                    </Col>
                </Row>

            </Form>

        </Container>
    )

}

export default CreateAccountForm;

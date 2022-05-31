// UserForm ------------------------------------------------------------------

// Detail editing form for User objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {ArrowUp} from "react-bootstrap-icons";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {CheckBoxField, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleUser} from "../../types";
import User, {UserData} from "../../models/User";
import {validateUserUsernameUnique} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleBack: HandleAction;           // Handle return to previous view
    handleInsert?: HandleUser;          // Handle User insert request [not allowed]
    handleRemove?: HandleUser;          // Handle User remove request [not allowed]
    handleUpdate?: HandleUser;          // Handle User update request [not allowed]
    user: User;                         // Initial values (id null for adding)
}

// Component Details ---------------------------------------------------------

const UserForm = (props: Props) => {

    const [adding] = useState<boolean>(!props.user.id);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        if (props.handleRemove) {
            props.handleRemove(props.user);
        }
    }

    const onSubmit: SubmitHandler<UserData> = (values) => {
        const theUser = new User({
            ...props.user,
            ...values,
        });
        logger.debug({
            context: "UserForm.onSubmit",
            adding: adding,
            user: theUser,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theUser);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theUser);
        }
    }

    // NOTE - there is no server-side equivalent for this because there is
    // not an individual logged-in user performing the request
    // NOTE - needs LoginContext to provide validateScope() method
    const validateRequestedScope = (requested: string | undefined): boolean => {
        return true; // NOTE - needs server side support
        /*
                if (!requested || ("" === requested)) {
                    return true;  // Not asking for scope but should be required
                } else {
                    // NOTE - deal with log:<level> pseudo-scopes
                    return loginContext.validateScope(requested);
                }
        */
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        email: Yup.string()
            .nullable(),
        firstName: Yup.string()
            .required("First Name is required"),
        lastName: Yup.string()
            .required("Last Name is required"),
        password: Yup.string() // NOTE - required on add, optional on edit
            .nullable(),
        scope: Yup.string()
            .required("Scope is required")
            .test("allowed-scope",
                "You are not allowed to assign a scope you do not possess",
                function(value) {
                    return validateRequestedScope(value);
                }),
        username: Yup.string()
            .required("Username is required")
            .test("unique-username",
                "That username is already in use",
                async function (this) {
                    return validateUserUsernameUnique(ToModel.USER(this.parent))
                }),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<UserData>({
        defaultValues: new UserData(props.user),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="UserForm">

                <Row className="mb-3">
                    <Col className="text-start">
                        <strong>
                            {(adding)? (
                                <span>Add </span>
                            ) : (
                                <span>Edit </span>
                            )}
                            <span>User</span>
                        </strong>
                    </Col>
                    <Col className="text-end">
                        <Button
                            onClick={() => props.handleBack()}
                            size="sm"
                            variant="secondary"
                        >
                            <ArrowUp size={32}/>
                        </Button>
                    </Col>
                </Row>

                <Form
                    id="UserFormDetails"
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
                            valid="First Name or description of this User."
                        />
                        <TextField
                            errors={errors}
                            label="Last Name:"
                            name="lastName"
                            register={register}
                            valid="Last Name or description of this User."
                        />
                    </Row>

                    <Row className="mb-3" id="usernamePasswordRow">
                        <TextField
                            errors={errors}
                            label="Username:"
                            name="username"
                            register={register}
                            valid="Login username for this User (must be unique)."
                        />
                        <TextField
                            errors={errors}
                            label="Password:"
                            name="password"
                            register={register}
                            valid="Enter ONLY for a new User or if you want to change the password for an existing User."
                        />
                    </Row>

                    <Row className="mb-3" id="emailScopeRow">
                        <TextField
                            errors={errors}
                            label="Email Address:"
                            name="email"
                            register={register}
                            valid="Email address of this User."
                        />
                        <TextField
                            errors={errors}
                            label="Scope:"
                            name="scope"
                            register={register}
                            valid="Permission(s) granted to this User."
                        />
                    </Row>

                    <Row className="mb-3" id="activeRow">
                        <CheckBoxField
                            errors={errors}
                            label="Active?"
                            name="active"
                            register={register}
                        />
                    </Row>

                    <Row className="mb-3">
                        <Col className="text-start">
                            <Button
                                disabled={!props.handleInsert && !props.handleUpdate}
                                size="sm"
                                type="submit"
                                variant="primary"
                            >
                                Save
                            </Button>
                        </Col>
                        <Col className="text-end">
                            <Button
                                disabled={adding || !props.handleRemove}
                                onClick={onConfirm}
                                size="sm"
                                type="button"
                                variant="danger"
                            >
                                Remove
                            </Button>
                        </Col>
                    </Row>

                </Form>

            </Container>

            {/* Remove Confirm Modal */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="bg-danger"
                onHide={onConfirmNegative}
                show={showConfirm}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>WARNING:  Potential Data Loss</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Removing this User is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this User as inactive instead.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onConfirmPositive}
                        size="sm"
                        type="button"
                        variant="danger"
                    >
                        Remove
                    </Button>
                    <Button
                        onClick={onConfirmNegative}
                        size="sm"
                        type="button"
                        variant="primary"
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>

    )
}

export default UserForm;

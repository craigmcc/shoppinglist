// ProfileForm ---------------------------------------------------------------

// Form for editing a User's profile information.

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

import {HandleUser} from "../../types";
import User, {UserData} from "../../models/User";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleUpdate: HandleUser;           // Handle User update request
    user: User;                         // Initial values
}

// Component Details ---------------------------------------------------------

const ProfileForm = (props: Props) => {

    const onSubmit: SubmitHandler<UserData> = (values) => {
        const theUser = new User({
            id: props.user.id,
            email: values.email ? values.email : undefined,
            firstName: values.firstName ? values.firstName : undefined,
            lastName: values.lastName ? values.lastName : undefined,
        });
        logger.debug({
            context: "ProfileForm.onSubmit",
            user: theUser,
        });
        props.handleUpdate(theUser);
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .nullable(),
        firstName: Yup.string()
            .required("First Name is required"),
        lastName: Yup.string()
            .required("Last Name is required"),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<UserData>({
        defaultValues: new UserData(props.user),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="ProfileForm">
            <Form
                id="ProfileFormDetails"
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

                <Row className="mb-3" id="emailRow">
                    <TextField
                        errors={errors}
                        label="Email Address:"
                        name="email"
                        register={register}
                        valid="Your email address."
                    />
                </Row>

                <Row className="mb-3">
                    <Col className="text-center">
                        <Button
                            size="sm"
                            type="submit"
                            variant="primary"
                        >
                            Save
                        </Button>
                    </Col>
                </Row>

            </Form>
        </Container>
    )

}

export default ProfileForm;

// PasswordForm --------------------------------------------------------------

// Form for changing your password (if logged in) or resetting it (if forgotten).

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {TextField} from "@craigmcc/shared-react";
import {Validators} from "@craigmcc/shared-utils";

// Internal Modules ----------------------------------------------------------

import {HandleValue} from "../../types";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleEmail: HandleValue;           // Handle email address to send to
}

// Component Details ---------------------------------------------------------

const ResetForm = (props: Props) => {

    type Values = {
        email: string | null;
    }

    const [autoFocus] = useState<boolean>(props.autoFocus ? props.autoFocus : false);

    const onSubmit: SubmitHandler<Values> = (values) => {
        logger.debug({
            context: "ResetForm.onSubmit",
            email: values.email,
        });
        // @ts-ignore
        props.handleEmail(values.email);
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .test("valid-email",
                "Invalid email format",
                function (value) {
                    return Validators.email(value ? value : "");
                }),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<Values>({
        defaultValues: {
            email: null,
        },
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="ResetForm">
            <Form
                id="ResetFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="emailRow">
                    <TextField
                        autoFocus={autoFocus}
                        errors={errors}
                        label="Email Address:"
                        name="email"
                        register={register}
                        valid="Your email address (must have a valid account)."
                    />
                </Row>

                <Row className="mb-3">
                    <Col className="text-center">
                        <Button
                            size="sm"
                            type="submit"
                            variant="primary"
                        >
                            <>Request Reset</>
                        </Button>
                    </Col>
                </Row>

            </Form>
        </Container>
    )

}

export default ResetForm;

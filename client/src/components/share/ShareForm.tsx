// ShareForm -----------------------------------------------------------------

// Form for sharing a List.

// External Modules ----------------------------------------------------------

import React, {useContext} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {CheckBoxField, TextField} from "@craigmcc/shared-react";
import {Validators} from "@craigmcc/shared-utils";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {HandleShare} from "../../types";
import Share from "../../models/Share";
import logger from "../../util/ClientLogger";
import List from "../../models/List";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleSave: HandleShare;            // Handle share save request
    list: List;                         // List being shared
}

// Component Details ---------------------------------------------------------

const ShareForm = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const onSubmit: SubmitHandler<Share> = (values) => {
        const theShare = new Share(values);
        logger.debug({
            context: "ShareForm.onSubmit",
            share: theShare,
        });
        props.handleSave(theShare);
    }

    const validationSchema = Yup.object().shape({
        admin: Yup.boolean(),
        email: Yup.string()
            .required()
            .test("valid-email",
                "Invalid email format",
                function (value) {
                    return Validators.email(value ? value : "");
                })
            .test("duplicate-email",
                "Can not share to yourself",
                function (value) {
                    return value !== loginContext.user.email;
                }),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<Share>({
        defaultValues: new Share({
            id: "TODO",
            admin: true,
            email: "",
            listId: props.list.id,
        }),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="ShareForm">
            <Form
                id="ShareFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="emailRow">
                    <TextField
                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                        errors={errors}
                        label="Email Address:"
                        name="email"
                        register={register}
                        valid="Email address of the person to share this List with."
                    />
                </Row>

                <Row className="mb-3" id="adminRow">
                    <CheckBoxField
                        errors={errors}
                        label="Should the person have admin permissions on this List?"
                        name="admin"
                        register={register}
                    />
                </Row>

                <Row className="mb-3">
                    <Col className="text-center">
                        <Button
                            size="sm"
                            type="submit"
                            variant="primary"
                        >
                            Share
                        </Button>
                    </Col>
                </Row>

            </Form>
        </Container>
    )

}

export default ShareForm;

// ListForm ------------------------------------------------------------------

// Form for editing or creating a List.

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
import {CheckBoxField, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleList} from "../../types";
import List, {ListData} from "../../models/List";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleSave: HandleList;             // Handle List save request
    list: List;                         // Initial values
}

// Component Details ---------------------------------------------------------

const ListForm = (props: Props) => {

    const onSubmit: SubmitHandler<ListData> = (values) => {
        const theList = new List(values);
        logger.debug({
            context: "ListForm.onSubmit",
            list: theList,
        });
        props.handleSave(theList);
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        name: Yup.string()
            .required(),
        notes: Yup.string()
            .nullable(),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<ListData>({
        defaultValues: new ListData(props.list),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="ListForm">
            <Form
                id="ListFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="nameRow">
                    <TextField
                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                        errors={errors}
                        label="List Name:"
                        name="name"
                        register={register}
                        valid="Name of this List."
                    />
                </Row>

                <Row className="mb-3" id="notesRow">
                    <TextField
                        errors={errors}
                        label="Notes:"
                        name="notes"
                        register={register}
                        valid="Optional notes about this List."
                    />
                </Row>

                <Row className="mb-3" id="activePopulateRow">
                    <CheckBoxField
                        errors={errors}
                        label="Active?"
                        name="active"
                        register={register}
                    />
                    {(!props.list.id) ? (
                        <CheckBoxField
                            errors={errors}
                            label="Populate with standard Categories and Items?"
                            name="populate"
                            register={register}
                        />
                    ) : null }
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
    );

}

export default ListForm;

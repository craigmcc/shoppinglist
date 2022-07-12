// CategoryForm --------------------------------------------------------------

// Form for editing or creating a Category.

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

import {HandleCategory} from "../../types";
import Category, {CategoryData} from "../../models/Category";
import {validateCategoryNameUnique} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleSave: HandleCategory;         // Handle Category save request
    category: Category;                 // Initial values
}

// Component Details ---------------------------------------------------------

const CategoryForm = (props: Props) => {

    const onSubmit: SubmitHandler<CategoryData> = (values) => {
        const theCategory = new Category(values);
        logger.debug({
            context: "CategoryForm.onSubmit",
            category: theCategory,
        });
        props.handleSave(theCategory);
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        name: Yup.string()
            .nullable()
            .required("Name is required")
            .test("unique-name",
                "That name is already in use within this List",
                async function (this) {
                    return validateCategoryNameUnique(ToModel.CATEGORY(this.parent));
                }),
        notes: Yup.string()
            .nullable(),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<CategoryData>({
        defaultValues: new CategoryData(props.category),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="CategoryForm">
            <Form
                id="CategoryFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="nameRow">
                    <TextField
                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                        errors={errors}
                        label="Category Name:"
                        name="name"
                        register={register}
                        valid="Name of this Category."
                    />
                </Row>

                <Row className="mb-3" id="notesRow">
                    <TextField
                        errors={errors}
                        label="Notes:"
                        name="notes"
                        register={register}
                        valid="Optional notes about this Category."
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

export default CategoryForm;

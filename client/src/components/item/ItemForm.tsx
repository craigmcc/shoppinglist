// ItemForm --------------------------------------------------------------

// Form for editing or creating an Item.

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
import {CheckBoxField, SelectField, SelectOption, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleItem} from "../../types";
import Category from "../../models/Category";
import Item, {ItemData} from "../../models/Item";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    categories: Category[];             // Available categories for assignment
    handleSave: HandleItem;             // Handle Item save request
    item: Item;                         // Initial values
}

// Component Details ---------------------------------------------------------

const ItemForm = (props: Props) => {

    const categories = (): SelectOption[] => {
        const results: SelectOption[] = [];
        results.push({value: "", label: "(Please Select)"});
        props.categories.forEach(category => {
            results.push({value: category.id, label: category.name});
        });
        return results;
    }

    const onSubmit: SubmitHandler<ItemData> = (values) => {
        const theItem = new Item(values);
        logger.debug({
            context: "ItemForm.onSubmit",
            item: theItem,
        });
        props.handleSave(theItem);
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        categoryId: Yup.string()
            .required("Category is required"),
        name: Yup.string()
            .required(),
        notes: Yup.string()
            .nullable(),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<ItemData>({
        defaultValues: new ItemData(props.item),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <Container id="ItemForm">
            <Form
                id="ItemFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="nameRow">
                    <TextField
                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                        errors={errors}
                        label="Item Name:"
                        name="name"
                        register={register}
                        valid="Name of this Item."
                    />
                </Row>

                <Row className="mb-3" id="notesRow">
                    <TextField
                        errors={errors}
                        label="Notes:"
                        name="notes"
                        register={register}
                        valid="Optional notes about this Item."
                    />
                </Row>

                <Row className="mb-3" id="categoryIdActiveRow">
                    <SelectField
                        errors={errors}
                        label="Category"
                        name="categoryId"
                        options={categories()}
                        register={register}
                        valid="Category this Item belongs to."
                    />
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

export default ItemForm;

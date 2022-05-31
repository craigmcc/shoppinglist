// ItemForm ------------------------------------------------------------------

// Detail editing form for Item objects.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {CheckBoxField, SelectField, SelectOption, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleItem} from "../../types";
import useFetchCategories from "../../hooks/useFetchCategories";
import Category from "../../models/Category";
import Item, {ItemData} from "../../models/Item";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import {validateItemNameUnique} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";
import {ArrowUp} from "react-bootstrap-icons";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should the first element receive autoFocus? [false]
    category?: Category;                // Optional parent Category for this Item
    item: Item;                         // Initial values (id===null for adding)
    handleBack: HandleAction;           // Handle return to previous view
    handleInsert?: HandleItem;          // Handle Item insert request [not allowed]
    handleRemove?: HandleItem;          // Handle Item remove request [not allowed]
    handleUpdate?: HandleItem;          // Handle Item update request [not allowed]
    list: List;                         // Parent List for this Item
}

// Component Details ---------------------------------------------------------

const INVALID_CATEGORY_ID = "INVALID";

const ItemForm = (props: Props) => {

    const [adding] = useState<boolean>(!props.item.id);
    const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const fetchCategories = useFetchCategories({
        alertPopup: false,
        list: props.list,
    });

    useEffect(() => {

        logger.info({
            context: "ItemForm.useEffect",
            category: props.category ? props.category : undefined,
            item: props.item,
            list: Abridgers.LIST(props.list),
        });

        const theCategoryOptions: SelectOption[] = [];
        theCategoryOptions.push({
            label: "(Select Category)",
            value: INVALID_CATEGORY_ID,
        });
        fetchCategories.categories.forEach(category => {
            const result: SelectOption = {
                label: category.name,
                value: category.id,
            };
            theCategoryOptions.push(result);
        });
        setCategoryOptions(theCategoryOptions);

    }, [props.category, props.item, props.list, fetchCategories.categories]);

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        if (props.handleRemove) {
            props.handleRemove(props.item);
        }
    }

    const onSubmit: SubmitHandler<ItemData> = (values) => {
        const theItem = new Item({
            ...props.item,
            ...values,
        });
        logger.debug({
            context: "ItemForm.onSubmit",
            adding: adding,
            item: theItem,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theItem);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theItem);
        }
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        categoryId: Yup.string()
            .required("Category is required")
            .test("valid-category",
                "You must select a valid category",
                function (value) {
                    return (value !== INVALID_CATEGORY_ID);
                }),
        name: Yup.string()
            .required("Name is required")
            .test("unique-name",
                "That list name is already in use",
                async function (this) {
                    return validateItemNameUnique(props.list, ToModel.ITEM(this.parent));
                }),
        notes: Yup.string()
            .nullable(),
        theme: Yup.string()
            .nullable(),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<ItemData>({
        defaultValues: new ItemData(props.item),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (
        <>

            {/* Details Form */}
            <Row className="mb-3">
                <Col className="text-start">
                    <strong>
                        {(adding)? (
                            <span>Add Item</span>
                        ) : (
                            <span>Edit Item</span>
                        )}
                        {(props.category) ? (
                            <>
                                <span>&nbsp;in&nbsp;</span>
                                <span className="text-info">{props.category.name}</span>
                            </>
                        ) : null }
                        <span>&nbsp;for&nbsp;</span>
                        <span className="text-info">{props.list.name}</span>
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
                id="ItemFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="nameRow">
                    <TextField
                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                        errors={errors}
                        label="Name:"
                        name="name"
                        register={register}
                        valid="Name of this Item."
                    />
                </Row>

                {(!props.category) ? (
                    <Row className="mb-3" id="categoryRow">
                        <SelectField
                            errors={errors}
                            label="Category:"
                            name="categoryId"
                            options={categoryOptions}
                            register={register}
                            valid="Category this Item belongs to."
                        />
                    </Row>
                ) : null }

                <Row className="mb-3" id="notesRow">
                    <TextField
                        errors={errors}
                        label="Notes:"
                        name="notes"
                        register={register}
                        valid="Optional notes about this Item."
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
                    {(props.handleRemove) ? (
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
                    ) : null }
                </Row>

            </Form>

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
                        Removing this Item is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Item as inactive instead.</p>
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

export default ItemForm;

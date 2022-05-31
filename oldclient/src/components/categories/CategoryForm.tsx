// CategoryForm --------------------------------------------------------------

// Detail editing form for Category objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {CheckBoxField, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleCategory} from "../../types";
import Category, {CategoryData} from "../../models/Category";
import List from "../../models/List";
import {validateCategoryNameUnique} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";
import {ArrowUp} from "react-bootstrap-icons";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should the first element receive autoFocus? [false]
    category: Category;                 // Initial values (id===null for adding)
    handleBack: HandleAction;           // Handle return to previous view
    handleInsert?: HandleCategory;      // Handle Category insert request [not allowed]
    handleRemove?: HandleCategory;      // Handle Category remove request [not allowed]
    handleUpdate?: HandleCategory;      // Handle Category update request [not allowed]
    list: List;                         // Parent List for this Category
}

// Component Details ---------------------------------------------------------

const CategoryForm = (props: Props) => {

    const [adding] = useState<boolean>(!props.category.id);
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
            props.handleRemove(props.category);
        }
    }

    const onSubmit: SubmitHandler<CategoryData> = (values) => {
        const theCategory = new Category({
            ...props.category,
            ...values,
        });
        logger.debug({
            context: "CategoryForm.onSubmit",
            adding: adding,
            category: theCategory,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theCategory);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theCategory);
        }
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        name: Yup.string()
            .required("Name is required")
            .test("unique-name",
                "That list name is already in use",
                async function (this) {
                    return validateCategoryNameUnique(props.list, ToModel.CATEGORY(this.parent));
                }),
        notes: Yup.string()
            .nullable(),
        theme: Yup.string()
            .nullable(),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<CategoryData>({
        defaultValues: new CategoryData(props.category),
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
                            <span>Add </span>
                        ) : (
                            <span>Edit </span>
                        )}
                        <span>Category in </span>
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
                id="CategoryFormDetails"
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
                        Removing this Category is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Category as inactive instead.</p>
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

export default CategoryForm;

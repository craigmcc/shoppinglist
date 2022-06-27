// AcceptForm ----------------------------------------------------------------

// Form for accepting a Share invitation.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ReCAPTCHA from "react-google-recaptcha";
import {SubmitHandler, useForm} from "react-hook-form"
import {CheckBoxField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {RECAPTCHA_SITE_KEY} from "../../constants";
import {HandleShare} from "../../types";
import Share from "../../models/Share";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleAccept: HandleShare;          // Handle a positive acceptance
    share: Share;                       // Share being accepted
}

// Component Details ---------------------------------------------------------

const AcceptForm = (props: Props) => {

    type Values = {
        accepted: boolean;
    }

    const [token, setToken] = useState<string>("");

    const onSubmit: SubmitHandler<Values> = (values) => {
        const share = new Share({
            ...props.share,
            token: token,
        });
        logger.debug({
            context: "AcceptForm.onSubmit",
            accepted: values.accepted,
            share: share,
        });
        if (values.accepted) {
            props.handleAccept(share);
        } else {
            alert("You must click the Accept checkbox in order to accept this invitation");
        }
    }

    // The reCAPTCHA check was successfully completed
    const onSuccess = (theToken: string | null): void => {
        setToken(theToken ? theToken : "");
    }

    const {formState: {errors}, handleSubmit, register} = useForm<Values>({
        defaultValues: { accepted: false },
        mode: "onBlur",
    });

    return (
        <Container id="AcceptForm">
            <Form
                id="AcceptFormDetails"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
            >

                <Row className="mb-3" id="acceptedRow">
                        <CheckBoxField
                            errors={errors}
                            label="Accept the invitation to share this List?"
                            name="accepted"
                            register={register}
                        />
                </Row>

                <Row className="mb-3" id="captchaAcceptRow">
                    <Col className="text-center">
                        <ReCAPTCHA
                            onChange={onSuccess}
                            sitekey={RECAPTCHA_SITE_KEY}
                            size="normal"
                        />
                    </Col>
                    <Col className="text-center">
                        <Button
                            disabled={(token.length === 0)}
                            size="sm"
                            type="submit"
                            variant="primary"
                        >Accept</Button>
                    </Col>
                </Row>

            </Form>
        </Container>
    )

}

export default AcceptForm;

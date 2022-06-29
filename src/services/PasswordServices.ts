// PasswordServices ----------------------------------------------------------

// Limited services required to process requests for Password information.

// External Modules ----------------------------------------------------------

import Mail from "nodemailer/lib/mailer";
const uuid = require("uuid");

// Internal Modules ----------------------------------------------------------

import {verifyTokenV2} from "./CaptchaServices";
import EmailServices from "./EmailServices";
import Password from "../models/Password";
import User from "../models/User";
import {hashPassword} from "../oauth/OAuthUtils";
import {BadRequest, NotFound, ServiceUnavailable} from "../util/HttpErrors";

const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : "";
const PASSWORD_EXPIRES_DELTA = process.env.PASSWORD_EXPIRES_DELTA
    ? Number(process.env.PASSWORD_EXPIRES_DELTA)
    : 1 * 24 * 60 * 60 * 1000;      // One day in milliseconds

// Public Classes ------------------------------------------------------------

class PasswordServices {

    /**
     * Find and return the Password with the specified ID.
     *
     * @param passwordId                ID of the requested password
     */
    public async find(passwordId: string): Promise<Password> {
        const password = await Password.findOne({
            include: [ User ],
            where: { id: passwordId },
        });
        if (password) {
            return password;
        } else {
            throw new NotFound(`passwordId: Missing Password ${passwordId}`);
        }
    }

    /**
     * Email an offer to reset the password for a User with the
     * included email address.
     *
     * @param email                     Email address to send an offer to
     */
    public async forgot(email: string): Promise<void> {

        // Ensure that there is a User with this email address
        const user = await User.findOne({
            where: { email: email },
        });
        if (!user) {
            throw new BadRequest("There is no user with that email address");
        }

        // Configure the Password that we will be storing
        const password = {
            id: uuid.v4(),
            email: email,
            expires: new Date((new Date()).getTime() + PASSWORD_EXPIRES_DELTA),
            userId: user.id,
        }

        // Compose the html version of the reset message
        // NOTE - the "/#" part is because we need to use HashRouter
        const RESET_URL = `${BASE_URL}/#/passwords/${password.id}`;
        let html:string = `
            <p>
                You have requested a link to reset your password.
                Click on the following link and fill out the form:
            </p>
            <p>
                <a href="${RESET_URL}">${RESET_URL}</a>.
            </p>
        `;

        // Compose the text version of the reset message
        let text: string = `
            You have requested a link to reset your password.\r\n
            Click on the following link and fill out the form:\r\n
            \r\n
            ${RESET_URL}
        `;

        // Email a message containing the offer to this email address
        const message: Mail.Options = {
            html: html,
            subject: "Reset your Shopping List password",
            text: text,
            to: email,
        }
        await EmailServices.send(message);

        // Create a Password instance for this offer
        // @ts-ignore
        await Password.create(password);

    }

    /**
     * Update the password for the specified user.
     *
     * @param user                      User whose password is being updated
     * @param password                  Password with reCAPTCHA token
     */
    public async update(user: User, password: Password): Promise<void> {

        // Verify that the included reCAPTCHA token is valid
        const verifyTokenResponse = await verifyTokenV2(password.token ? password.token :"");
        if (!verifyTokenResponse.success) {
            throw new ServiceUnavailable("Failed ReCAPTCHA validation");
        }

        // Verify that the two password values match
        if (!password.password1 || !password.password2 || (password.password1 !== password.password2)) {
            throw new BadRequest("Password values do not match");
        }

        // Update the password on this User
        const thePassword = await hashPassword(password.password1);
        await User.update({
                password: thePassword,
            },
            {
                fields: [ "password" ],
                where: { id: user.id }
            });

    }

}

export default new PasswordServices();

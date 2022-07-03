// ShareServices -------------------------------------------------------------

// Limited services required to process requests for Share information.

// External Modules ----------------------------------------------------------

import Mail from "nodemailer/lib/mailer";
const uuid = require("uuid");

// Internal Modules ----------------------------------------------------------

import {verifyTokenV2} from "./CaptchaServices";
import EmailServices from "./EmailServices";
import ListServices from "./ListServices";
import UserServices from "./UserServices";
import List from "../models/List";
import Share from "../models/Share";
import User from "../models/User";
import {BadRequest, NotFound, ServiceUnavailable} from "../util/HttpErrors";

const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : "";
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "test";
const SHARE_EXPIRES_DELTA = process.env.SHARE_EXPIRES_DELTA
    ? Number(process.env.SHARE_EXPIRES_DELTA)
    : 1 * 24 * 60 * 60 * 1000;      // One day in milliseconds

// Public Objects ------------------------------------------------------------

class ShareServices {

    /**
     * Accept a Share offer.
     *
     * @param shareId                   ID of the Share being accepted
     * @param input                     Data including reCAPTCHA token
     * @param user                      User accepting the Share
     */
    public async accept(shareId: string, input: Share, user: User): Promise<Share> {

        // Verify that the included reCAPTCHA token is valid
        const verifyTokenResponse = await verifyTokenV2(input.token ? input.token :"");
        if (!verifyTokenResponse.success) {
            throw new ServiceUnavailable("Failed ReCAPTCHA validation");
        }

        // Verify that the specified Share exists
        const share = await Share.findByPk(shareId);
        if (!share) {
            throw new NotFound(`Missing Share ${shareId}`);
        }

        // Verify that the specified List exists
        const list = await List.findByPk(share.listId);
        if (!list) {
            throw new NotFound(`Missing List ${share.listId}`)
        }

        // Verify that the requesting User has an email address matching the invite
        if (input.email !== user.email) {
            throw new BadRequest(`Invite was for a different email address`);
        }

        // Associate the User and List
        await UserServices.listsInclude(user.id, list.id, share.admin);

        // Delete the Share now that it has been completed
        await Share.destroy({
            where: { id : shareId }
        });

        // Return the input Share to signal successful completion
        return input;

    }

    /**
     * Find and return the specified Share.
     *
     * @param shareId                   ID of the Share to be returned
     */
    public async find(shareId: string): Promise<Share> {
        const share = await Share.findOne({
            include: [ List ],
            where: { id: shareId },
        });
        if (share) {
            return share;
        } else {
            throw new NotFound(`shareId: Missing Share ${shareId}`);
        }
    }

    /**
     * Email an offer to share the specified List with a new or existing
     * User at the specified email address.
     *
     * @param listId                    ID of the List being offered
     * @param email                     Email address of the offeree
     * @param admin                     Will this user receive admin permissions?
     *
     * @return Share representing this offer
     */
    public async offer(listId: string, share: Share): Promise<Share> {

        // Look up the list to be shared
        const list = await ListServices.read("ShareServices.share", listId, {
            withUsers: "",
        });

        // See if there is already a User with this email address
        const user = await User.findOne({
            where: { email: share.email},
        });

        // Configure the Share that we will be storing
        const store = {
            id: uuid.v4(),
            admin: (share.admin !== undefined) ? share.admin : true,
            email: share.email,
            expires: new Date((new Date()).getTime() + SHARE_EXPIRES_DELTA),
            listId: listId, // No cheating
        }

        // Compose the html version of the invitation message
        // NOTE - the "/#" part is because we need to use HashRouter
        const ACCEPT_URL = `${BASE_URL}/#/accept/${store.id}`;
        let html: string = `
                <p>
                    ${list.users[0].firstName} ${list.users[0].lastName}
                    is offering to share a Shopping List named
                    <strong>${list.name}</strong> with you.
                </p>
        `;
        if (user) {
            html += `
                <p>
                    Please log in to your Shopping List account (if you
                    are not aleady logged in) at
                    <a href="${BASE_URL}">${BASE_URL}</a>.
                </p>
            `;
        } else {
            html += `
                <p>
                    If you do not have a Shopping List account yet, first
                    please create one (with this email address) at
                    <a href="${BASE_URL}">${BASE_URL}</a> and log in to it.
                </p>
            `
        }
        html += `
                <p>
                    Next, click on the following link to accept the invitation:
                    <a href="${ACCEPT_URL}">${ACCEPT_URL}</a>.
                </p>
        `;

        // Compose the text version of the invitation message
        let text = `
                ${list.users[0].firstName} ${list.users[0].lastName} is offering to\r\n
                share a Shopping List named "${list.name}" with you.\r\n
                \r\n
        `;
        if (user) {
            text += `
                Please log in to your Shopping List account (if you are not already logged in) at\r\n
                \r\n
                ${BASE_URL}\r\n
                \r\n
            `;
        } else {
            text += `
                If you do not have a Shopping List account yet, first please create\r\n
                one (with this email address) at\r\n
                \r\n
                ${BASE_URL}\r\n
                \r\n
                and log in to it.\r\n
                \r\n
            `;
        }
        text += `
                Next, click on the following link to accept the invitation:\r\n
                \r\n
                "${BASE_URL}\r\n
                \r\n
        `;

        // Email a message containing the offer to this User
        const message: Mail.Options = {
            html: html,
            subject: "Offer to access a ShoppingList shared list",
            text: text,
            to: share.email,
        }
        if (NODE_ENV !== "test") {
            await EmailServices.send(message);
        } else {
            console.log("Suppressed 'Share List' email in test mode to ", share.email);
        }

        // Create and return a Share instance for this offer
        // @ts-ignore
        const output = await Share.create(store);
        return output;

    }

}

export default new ShareServices();

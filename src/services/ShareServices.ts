// ShareServices -------------------------------------------------------------

// Limited services required to process requests for Share information.

// External Modules ----------------------------------------------------------

import {Model} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import {verifyTokenV2} from "./CaptchaServices";
import UserServices from "./UserServices";
import List from "../models/List";
import Share from "../models/Share";
import User from "../models/User";
import {BadRequest, NotFound, ServiceUnavailable} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

class ShareServices {

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

}

export default new ShareServices();

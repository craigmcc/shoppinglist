// ScopeServices -------------------------------------------------------------

// Shared services to adjust scopes on existing access tokens when
// Users and Lists are associated or disassociated.

// External Modules ----------------------------------------------------------

import {Op, Transaction} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import {ADMIN_PERMISSION, REGULAR_PERMISSION} from "../oauth/OAuthMiddleware";

// Public Objects ------------------------------------------------------------

export class ScopeServices {

    // Public Methods --------------------------------------------------------

    /**
     * Reflect a disassociation between the specified User and List.
     *
     * @param userId                    ID of the involved User
     * @param listId                    ID of the involved List
     * @param transaction               Optional transaction to participate in
     */
    public async exclude(userId: string, listId: string, transaction?: Transaction): Promise<void> {

        // Select the potential target access tokens
        const potentials = await this.accessTokens(userId);
        if (potentials.length === 0) {
            return;
        }

        // Filter down to the AccessTokens that need an added scope
        const targets: AccessToken[] = [];
        potentials.forEach(potential => {
            const scopes = potential.scope.split(" ");
            let found = false;
            scopes.forEach(scope => {
                if (scope.endsWith(`:${listId}`)) {
                    found = true;
                }
            });
            if (found) {
                targets.push(potential);
            }
        });
        if (targets.length === 0) {
            return;
        }

        // Remove the old scope from the target AccessTokens
        const promises: Promise<[number]>[] = [];
        targets.forEach(target => {
            const oldScopes = target.scope.split(" ");
            const newScopes =
                oldScopes.filter(oldScope => !oldScope.endsWith(`:${listId}`));
            const promise = AccessToken.update(
                {
                    scope: newScopes.join(" "),
                },
                {
                    transaction: transaction ? transaction : undefined,
                    where: { id: target.id },
                }
            )
        });
        await Promise.all(promises);

    }

    /**
     * Reflect an association between the specified User and List.
     *
     * @param userId                    ID of the involved User
     * @param listId                    ID of the involved List
     * @param admin                     Is this User an admin for this List?
     * @param transaction               Optional transaction to participate in
     */
    public async include(userId: string, listId: string, admin: boolean, transaction?: Transaction): Promise<void> {

        // Select the potential target access tokens
        const potentials = await this.accessTokens(userId);
        if (potentials.length === 0) {
            return;
        }

        // Filter down to the AccessTokens that need an added scope
        const targets: AccessToken[] = [];
        const scope = `${admin ? ADMIN_PERMISSION : REGULAR_PERMISSION}:${listId}`;
        potentials.forEach(potential => {
            const scopes = potential.scope.split(" ");
            let found = false;
            if (scopes.includes(scope)) {
                found = true;
            }
            if (!found) {
                targets.push(potential);
            }
        });
        if (targets.length === 0) {
            return;
        }

        // Add the new scope for each target AccessToken
        const promises: Promise<[number]>[] = [];
        targets.forEach(target => {
            const promise = AccessToken.update(
                {
                    scope: target.scope + " " + scope,
                }, {
                    transaction: transaction ? transaction : undefined,
                    where: {id: target.id},
                });
            promises.push(promise);
        });
        await Promise.all(promises);

    }

    // Private Methods -------------------------------------------------------

    private async accessTokens(userId: string): Promise<AccessToken[]> {
        const now = new Date();
        const accessTokens = await AccessToken.findAll({
            where: {
                expires: { [Op.gte]: now },
                userId: userId,
            }
        })
        return accessTokens;
    }

}

export default new ScopeServices();

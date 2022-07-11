// MockUserHandlers ----------------------------------------------------------

// Mock service worker handlers for User models.

// External Modules ----------------------------------------------------------

import {rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpErrorResponse} from "../Helpers";
import MockUserServices from "../services/MockUserServices";
import {CREATED, HttpError, OK} from "../../util/HttpErrors";
import * as ToModel from "../../util/ToModel";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/users";

export const MockUserHandlers: RestHandler[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}`, (req, res, ctx) => {
        const users = MockUserServices.all(req.url.searchParams);
        return res(
            ctx.status(OK),
            ctx.json(users),
        );
    }),

    // exact -----------------------------------------------------------------
    rest.get(`${PREFIX}/exact/:username`, (req, res, ctx) => {
        try {
            const {username} = req.params;
            // @ts-ignore
            const user = MockUserServices.exact(username);
            return res(
                ctx.status(OK),
                ctx.json(user),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // find ------------------------------------------------------------------
    rest.get(`${PREFIX}/:userId`, (req, res, ctx) => {
        try {
            const {userId} = req.params;
            // @ts-ignore
            const user = MockUserServices.find(userId, req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(user),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // insert ----------------------------------------------------------------
    rest.post(`${PREFIX}`, (req, res, ctx) => {
        try {
            // @ts-ignore
            const user = ToModel.USER(req.body);
            const inserted = MockUserServices.insert(user);
            return res(
                ctx.status(CREATED),
                ctx.json(inserted),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

];

export default MockUserHandlers;

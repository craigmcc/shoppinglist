// MockItemHandlers ----------------------------------------------------------

// Mock service worker handlers for Item models.

// External Modules ----------------------------------------------------------

import {rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpErrorResponse} from "../Helpers";
import MockItemServices from "../services/MockItemServices";
import {CREATED, OK} from "../../util/HttpErrors";
import * as ToModel from "../../util/ToModel";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/items";

export const MockItemHandlers: RestHandler[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}/:listId`, (req, res, ctx) => {
        try {
            const {listId} = req.params;
            // @ts-ignore
            const items = MockItemServices.all(listId, req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(items),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // exact -----------------------------------------------------------------
    rest.get(`${PREFIX}/:listId/exact/:name`, (req, res, ctx) => {
        try {
            const {listId, name} = req.params;
            // @ts-ignore
            const item = MockItemServices.exact(listId, name);
            return res(
                ctx.status(OK),
                ctx.json(item),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // find ------------------------------------------------------------------
    rest.get(`${PREFIX}/:listId/:itemId`, (req, res, ctx) => {
        try {
            const {itemId, listId} = req.params;
            // @ts-ignore
            const item = MockItemServices.find(listId, itemId);
            return res(
                ctx.status(OK),
                ctx.json(item),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // insert ----------------------------------------------------------------
    rest.post(`${PREFIX}/:listId`, (req, res, ctx) => {
        try {
            const {listId} = req.params;
            // @ts-ignore
            const item = ToModel.CATEGORY(req.body);
            // @ts-ignore
            const inserted = MockItemServices.insert(listId, item);
            return res(
                ctx.status(CREATED),
                ctx.json(inserted),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

];

export default MockItemHandlers;

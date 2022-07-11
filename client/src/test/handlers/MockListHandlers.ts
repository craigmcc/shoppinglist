// MockListHandlers ----------------------------------------------------------

// Mock service worker handlers for List models.

// External Modules ----------------------------------------------------------

import {rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpErrorResponse} from "../Helpers";
import MockListServices from "../services/MockListServices";
import {CREATED, HttpError, OK} from "../../util/HttpErrors";
import * as ToModel from "../../util/ToModel";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/lists";

export const MockListHandlers: RestHandler[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}`, (req, res, ctx) => {
        const lists = MockListServices.all(req.url.searchParams);
        return res(
            ctx.status(OK),
            ctx.json(lists),
        );
    }),

    // exact -----------------------------------------------------------------
    rest.get(`${PREFIX}/exact/:name`, (req, res, ctx) => {
        try {
            const {name} = req.params;
            // @ts-ignore
            const list = MockListServices.exact(name);
            return res(
                ctx.status(OK),
                ctx.json(list),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // find ------------------------------------------------------------------
    rest.get(`${PREFIX}/:listId`, (req, res, ctx) => {
        try {
            const {listId} = req.params;
            // @ts-ignore
            const list = MockListServices.find(listId, req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(list),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // insert ----------------------------------------------------------------
    rest.post(`${PREFIX}`, (req, res, ctx) => {
        try {
            // @ts-ignore
            const list = ToModel.LIST(req.body);
            const inserted = MockListServices.insert(list);
            return res(
                ctx.status(CREATED),
                ctx.json(inserted),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

];

export default MockListHandlers;

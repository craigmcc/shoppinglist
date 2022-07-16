// MockCategoryHandlers ------------------------------------------------------

// Mock service worker handlers for Category models.

// External Modules ----------------------------------------------------------

import {rest, RestHandler} from "msw";

// Internal Modules ----------------------------------------------------------

import {HttpErrorResponse} from "../Helpers";
import MockCategoryServices from "../services/MockCategoryServices";
import {CREATED, OK} from "../../util/HttpErrors";
import * as ToModel from "../../util/ToModel";

// Public Objects ------------------------------------------------------------

const PREFIX = "/api/categories";

export const MockCategoryHandlers: RestHandler[] = [

    // all -------------------------------------------------------------------
    rest.get(`${PREFIX}/:listId`, (req, res, ctx) => {
        try {
            const {listId} = req.params;
            // @ts-ignore
            const categories = MockCategoryServices.all(listId, req.url.searchParams);
            return res(
                ctx.status(OK),
                ctx.json(categories),
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
            const category = MockCategoryServices.exact(listId, name);
            return res(
                ctx.status(OK),
                ctx.json(category),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

    // find ------------------------------------------------------------------
    rest.get(`${PREFIX}/:listId/:categoryId`, (req, res, ctx) => {
        try {
            const {categoryId, listId} = req.params;
            // @ts-ignore
            const category = MockCategoryServices.find(listId, categoryId);
            return res(
                ctx.status(OK),
                ctx.json(category),
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
            const category = ToModel.CATEGORY(req.body);
            // @ts-ignore
            const inserted = MockCategoryServices.insert(listId, category);
            return res(
                ctx.status(CREATED),
                ctx.json(inserted),
            );
        } catch (error) {
            return HttpErrorResponse(res, ctx, error);
        }
    }),

];

export default MockCategoryHandlers;

// BaseParentServices --------------------------------------------------------

// Abstract base class for Services implementations for a Model class
// (one that does not require a parent instance for ownership), defining
// standard CRUD operation methods and required public helper methods.

// External Modules ----------------------------------------------------------

import {FindOptions, ModelStatic, Order, ValidationError} from "sequelize";
import {Model} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import BaseCommonServices from "./BaseCommonServices";
import {BadRequest, NotFound, NotUnique, ServerError} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Define standard CRUD operations for services of a parent Model class.
 */
abstract class BaseParentServices<M extends Model> extends BaseCommonServices<M> {

    /**
     * Construct a new services instance for the specified Sequelize Model.
     *
     * @param model                     Constructor for Model instance being supported
     * @param order                     Order object for standard sorting order
     * @param fields                    List of field names for this Model (no "id")
     */
    constructor (model: ModelStatic<M>, order: Order, fields: string[]) {
        super(model, order, fields);
    }

    // Standard CRUD Operations ----------------------------------------------

    /**
     * Return all model instances that match the specified criteria.
     *
     * @param query                     Optional match query parameters from HTTP request
     *
     * @returns List of matching model instances
     */
    public async all(query?: object): Promise<M[]> {
        const options: FindOptions = this.appendMatchOptions({
            order: this.order,
        }, query);
        // @ts-ignore
        return await this.model.findAll(options);
    }

    /**
     * Return the model instance with the specified ID.
     *
     * @param modelId                   ID of the requested model instance
     * @param query                     Optional include query parameters from the HTTP request
     *
     * @returns Requested model instance
     *
     * @throws NotFound if the requested model instance cannot be found
     */
    public async find(modelId: string, query?: any): Promise<M> {
        return await this.read(
            `${this.name}Services.find`,
            modelId,
            query
        );
    }

    /**
     * Insert and return a new model instance with the specified contents.
     *
     * @param model                     Object containing fields for the inserted instance
     *
     * @returns Inserted model instance (with "id" field)
     *
     * @throws BadRequest if validation error(s) occur
     * @throws NotFound if the specified model instance does not exist
     * @throws NotUnique if a unique key violation is attempted
     * @throws ServerError if some other error occurs
     */
    public async insert(model: Partial<M>): Promise<M> {
        try {
            // @ts-ignore
            return await this.model.create(model, {
                fields: this.fields,
            });
        } catch (error) {
            if (error instanceof BadRequest) {
                throw error;
            } else if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof NotUnique) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    `${this.name}Services.insert`
                );
            } else {
                throw new ServerError(
                    error as Error,
                    `${this.name}Services.insert`
                );
            }
        }
    }

    /**
     * Remove and return an existing model instance.
     *
     * @param modelId                   ID of the specified model instance
     *
     * @returns Removed model instance
     *
     * @throws NotFound if the specified model instance does not exist
     */
    public async remove(modelId: string): Promise<M> {
        const model: M = await this.read(`${this.name}Services.remove`, modelId);
        // @ts-ignore
        await this.model.destroy({
            where: { id: modelId }
        });
        return model;
    }

    /**
     * Update and return an existing model instance.
     *
     * @param modelId                  ID of the specified model instance
     * @param model                    Object containing fields to be updated
     *
     * @returns Updated model instance
     *
     * @throws BadRequest if validation error(s) occur
     * @throws NotFound if the specified model instance does not exist
     * @throws NotUnique if a unique key violation is attempted
     * @throws ServerError if some other error occurs
     */
    public async update(modelId: string, model: Partial<M>): Promise<M> {
        try {
            model = {
                ...model,
                id: modelId, // No cheating
            }
            // @ts-ignore
            const results = await this.model.update(model, {
                fields: this.fieldsWithId,
                returning: true,
                where: {id: modelId},
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `${this.key}: Missing ${this.name} ${modelId}`,
                    `${this.name}.update`
                );
            }
            return results[1][0];
        } catch (error) {
            if (error instanceof BadRequest) {
                throw error;
            } else if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof NotUnique) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    `${this.name}.update`
                );
            } else {
                throw new ServerError(
                    error as Error,
                    `${this.name}Services.update`
                );
            }
        }
    }

    // Public Helper Methods -------------------------------------------------

    /**
     * Find and return the requested model instance.
     *
     * @param context                   Call context for error messages
     * @param modelId                   ID of the requested model instance
     * @param query                     Optional include query parameters
     *
     * @returns Requested model instance
     *
     * @throws NotFound if this model instance does not exist
     */
    public async read(context: string, modelId: string, query?: any): Promise<M> {
        const options: FindOptions = this.appendIncludeOptions({
            where: { id: modelId }
        }, query);
        // @ts-ignore
        const parent = await this.model.findOne(options);
        if (parent) {
            return parent;
        } else {
            throw new NotFound(
                `${this.key}: Missing ${this.name} ${modelId}`,
                context,
            );
        }

    }

}

export default BaseParentServices;

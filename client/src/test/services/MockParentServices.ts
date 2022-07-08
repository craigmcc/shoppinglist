// MockParentServices --------------------------------------------------------

// Abstract base class for Services implementations for a Model class
// (one that does not require a parent instance for ownership), defining
// standard CRUD operation methods and required public helper methods.

// External Modules ----------------------------------------------------------

const uuid = require("uuid");

// Internal Modules ----------------------------------------------------------

import MockCommonServices, {ModelStatic} from "./MockCommonServices";
import Model from "../../models/Model";
import {NotFound} from "../../util/HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Define standard CRUD operations for services of a parent Model class.
 *
 * @param M                             Constructor for Model class of the parent being supported
 */
abstract class MockParentServices<M extends Model<M>> extends MockCommonServices<M> {

    /**
     * Construct a new services instance for the specified Model.
     *
     * @param model                     Constructor for Model instance being supported
     */
    constructor (model: ModelStatic<M>) {
        super(model);
    }

    // Protected Data --------------------------------------------------------

    /**
     * Model objects in this mock database, keyed by id.
     */
    protected map = new Map<string, M>;

    // Standard CRUD Operations ----------------------------------------------

    /**
     * Return all model instances that match the specified criteria.
     *
     * @param query                     Query parameters from HTTP request
     */
    public all(query?: URLSearchParams): M[] {
        const results: M[] = [];
        for (const result of this.map.values()) {
            if (this.matches(result, query)) {
                // TODO - handle includes
                results.push(result);
            }
        }
        return results;
    }

    /**
     * Return the model instance with the specified ID, or throw NotFound
     *
     * @param modelId                   ID of the requested instance
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no such instance is found
     */
    public find(modelId: string, query?: URLSearchParams): M {
        return this.read(`${this.name}Services.find`, modelId, query);
    }

    // Default Helper Methods ------------------------------------------------

    /**
     * Find and return the requested model instance.
     *
     * @param context                   Call context for error messages
     * @param modelId                   ID of the requested model instance
     * @param query                     Query parameters from HTTP request
     *
     * @throws NotFound                 If no such instance exists
     */
    public read(context: string, modelId: string, query?: URLSearchParams): M {
        const result = this.map.get(modelId);
        if (result) {
            return this.includes(result);
        } else {
            throw new NotFound(
                `${this.key}: Missing ${this.name} ${modelId}`,
                context,
            );
        }

    }

    /**
     * Reset the internal "database" to contain no instances.
     */
    public reset() {
        this.map.clear();
    }

    // Abstract Helper Methods -----------------------------------------------

    /**
     * Return a decorated instanceo of this model with extra fields for any
     * specified child models based on the query parameters.
     *
     * @param model                     Model to be decorated
     * @param query                     Query parameters from HTTP request
     */
    public abstract includes(model: M, query?: URLSearchParams): M;

    /**
     * Return true if the specified model matches criteria in the specified query.
     *
     * @param model                     Model instance being checked
     * @param query                     Query parameters to match
     */
    public abstract matches(model: M, query?: URLSearchParams): boolean;

}

export default MockParentServices;

// MockCommonServices --------------------------------------------------------

// Public helper methods common to both parent and child services implementations.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Model from "../../models/Model";
export type ModelStatic<M extends Model<M>> = {
    new (): M;
}

// Public Objects ------------------------------------------------------------

/**
 * Define standard public methods for services of a Model class (parent or child).
 */
abstract class MockCommonServices<M extends Model<M>> {

    /**
     * Construct a new Services instance for the specified Model.
     *
     * @param model                     Constructor for the Model instance being supported
     */
    constructor(model: ModelStatic<M>) {
        this.key = model.name.toLowerCase() + "Id";
        this.model = model;
        this.name = model.name;
    }

    // Readonly Data ---------------------------------------------------------

    /**
     * Name of the primary key reference for the model class we are supporting.
     */
    public readonly key: string;

    /**
     * Model constructor this service class will operate on.
     */
    public readonly model: ModelStatic<M>;

    /**
     * Name of the Model class we are supporting.
     */
    public readonly name: string;

}

export default MockCommonServices;

// Model ---------------------------------------------------------------------

// Base interface for model classes so that we can use generics to
// implement common services.

// Public Objects ------------------------------------------------------------

class Model<M> {

    constructor(id?: string) {
        this.id = id ? id : "";
    }

    public id: string;

}

export default Model;

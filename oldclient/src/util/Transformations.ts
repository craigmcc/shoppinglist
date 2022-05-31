// Transformations -----------------------------------------------------------

// Transform objects back and forth to how Formik wants fields presented.

// Public Objects ------------------------------------------------------------

// Convert a value to how it will be presented in a table, if needed
export const listValue = (value: any): string => {
    if (typeof(value) === "boolean") {
        return value ? "Yes" : "No"
    } else if (!value) {
        return "";
    } else {
        return value;
    }
}

// Convert null field values in incoming to empty strings
export const toEmptyStrings = (incoming: any): any => {
    let outgoing: any = { };
    for (const [key, value] of Object.entries(incoming)) {
        if (value !== null) {
            outgoing[key] = value;
        } else {
            outgoing[key] = "";
        }
    }
    return outgoing;
}

// Convert empty string values in incoming to nulls
export const toNullValues = (incoming: any): any => {
    let outgoing: any = { };
    for (const [key, value] of Object.entries(incoming)) {
        if (value === "") {
            outgoing[key] = null;
        } else {
            outgoing[key] = value;
        }
    }
    return outgoing;
}

// For each incoming item, copy it's fields to outgoing.  In addition, if the
// item has a field with key {name}, assume it is an object and add
// {name}.{subName} fields to the outgoing item for each field in the
// named object.  NOTE:  This only goes one level deep.
export const withFlattenedObject = (incoming: any, name: string): any => {
    let outgoing: any = { };
    for (const [key, value] of Object.entries(incoming)) {
        outgoing[key] = value;
        if ((key === name) && (value)) {
            let subValue: any = value;
            for (let subName in subValue) {
                outgoing[name + "." + subName] = subValue[subName];
            }
        }
    }
    return outgoing;
}

// Call withFlattenedObject for each item in incoming array, and return the
// resulting outgoing array
export const withFlattenedObjects = (incoming: any, name: any): any[] => {
    if (incoming.length === 0) {
        return [];
    }
    let outgoing: any[] = [];
    for (let index = 0; index < incoming.length; index++) {
        outgoing.push(withFlattenedObject(incoming[index], name));
    }
    return outgoing;
}


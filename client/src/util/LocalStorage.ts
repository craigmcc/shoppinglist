// LocalStorage --------------------------------------------------------------

// Typed wrapper for information stored in the browser's local storage.
// The specified type must be JSON serializable.

// External Modules ---------------------------------------------------------

// Internal Modules ---------------------------------------------------------

// Public Objects -----------------------------------------------------------

class LocalStorage<TYPE> {

    /**
     * Construct a new LocalStorage wrapper for the specified key name.
     *
     * @param keyName                   Local storage key for this instance
     * @param defaultValue              Default value [empty object if not specified]
     */
    constructor(keyName: string, defaultValue?: TYPE) {
        this.keyName = keyName;
        localStorage.setItem(keyName, JSON.stringify(defaultValue ? defaultValue : {}));
    }

    keyName: string;

    get value(): TYPE {
        const theValue = localStorage.getItem(this.keyName);
        console.log(`GET(${this.keyName})`, theValue);
        return JSON.parse(theValue ? theValue : "{}");
    }

    set value(newValue: TYPE) {
        console.log(`SET(${this.keyName})`, newValue);
        localStorage.setItem(this.keyName, JSON.stringify(newValue));
    }

}

export default LocalStorage;

// LocalStorage --------------------------------------------------------------

// Typed wrapper around access to a LocalStorage value for the specified key name.
// The specified type must be JSON serializable.

// External Modules ---------------------------------------------------------

// Internal Modules ---------------------------------------------------------

// Public Objects -----------------------------------------------------------

class LocalStorage<TYPE> {

    /**
     * Construct a new LocalStorage wrapper for the specified key name.
     *
     * @param keyName                   Local storage key for this instance
     * @param initialValue              Initially set value if no value is currently set
     *                                  [Not set if no initialValue is specified]
     */
    constructor(keyName: string, initialValue?: TYPE) {
        this.keyName = keyName;
        if (initialValue) {
            localStorage.setItem(keyName, JSON.stringify(initialValue));
        }
    }

    keyName: string;

    /**
     * Deserialize and return the current local storage value for this key.
     */
    get value(): TYPE {
        const theValue = localStorage.getItem(this.keyName);
        return JSON.parse(theValue ? theValue : "{}");
    }

    /**
     * Serialize and store the current local storage value for our key.
     *
     * @param newValue                  The new value to be stored
     */
    set value(newValue: TYPE) {
        localStorage.setItem(this.keyName, JSON.stringify(newValue));
    }

}

export default LocalStorage;

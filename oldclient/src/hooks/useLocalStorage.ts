// useLocalStorage -----------------------------------------------------------

// Typed wrapper for information stored in the browser's local storage.
// The specified type must be JSON serializable.

// External Modules ----------------------------------------------------------

import {useState} from "react";

// Internal Modules ----------------------------------------------------------

// Hook Definition -----------------------------------------------------------

/**
 * Typed wrapper around access to a LocalStorage value for the specified key name.
 * The specified type must be JSON serializable.
 *
 * @param keyName                       Local storage key for this instance
 * @param initialValue                  Initially set value
 *                                      [Not set if no initialValue is specified]
 */
function useLocalStorage<TYPE>(keyName: string, initialValue?: TYPE) {

    const [storedValue, setStoredValue] = useState(() => {
        const currentValue = window.localStorage.getItem(keyName);
        if (currentValue) {
            return JSON.parse(currentValue);
        }
        if (initialValue) {
            window.localStorage.setItem(keyName, JSON.stringify(initialValue));
            return initialValue;
        } else {
            return {};
        }
    });

    const setValue = (newValue: TYPE) => {
        window.localStorage.setItem(keyName, JSON.stringify(newValue));
        setStoredValue(newValue);
    };

    return [storedValue, setValue];

};

export default useLocalStorage;


// useLocalStorage -----------------------------------------------------------

// Store an arbitrary data object under the specified key in the browser's
// local storage.

// IMPLEMENTATION NOTE:  The data object must be serializable
// as a JSON string, so fields must be strings, numbers, or booleans.

// External Modules ----------------------------------------------------------

import {useState} from "react";

// Internal Modules ----------------------------------------------------------

import logger from "../util/ClientLogger";

// Hook Definition -----------------------------------------------------------

function useLocalStorage<TYPE>(keyName: string, defaultValue?: TYPE) {

    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value);
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (error) {
            return defaultValue;
        }
    });

    const setValue = (newValue: TYPE) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (error) {
            logger.error({
                context: "useLocalStorage.setValue",
                msg: "Error serializing new value",
                value: newValue,
                error: error,
            });
        }
        setStoredValue(newValue);
    };

    return [storedValue, setValue];

};

export default useLocalStorage;


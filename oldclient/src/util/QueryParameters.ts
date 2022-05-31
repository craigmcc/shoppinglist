// QueryParameters -----------------------------------------------------------

// Manage query parameters for a server URI.

// Public Objects ------------------------------------------------------------

export const queryParameters = (parameters: object | null): string => {
    let result = "";
    if (!parameters) {
        return result;
    }
    for (let [key, value] of Object.entries(parameters)) {
        if (value || (value === "")) {
            if (result.length === 0) {
                result += "?";
            } else {
                result += "&";
            }
            if (value === "") {
                result += key;
            } else {
                result += key + "=" + value;
            }
        }
    }
    return result;
}

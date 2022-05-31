// ReportError ---------------------------------------------------------------

// Log the specified error to the client logger, and pop up an alert with
// the appropriate message string.  In the error log, prepend the specified prefix
// to describe context where the error came from.

// If the error was a non-2xx HTTP status response, the error will contain a
// "response" field with the server's (Axios) response content embedded inside.
// In that case, dump the server response to the log, and extract the server's
// "message" field to display to the user.

// Internal Modules ----------------------------------------------------------

import logger from "./ClientLogger";

// Public Objects ------------------------------------------------------------

/**
 * Parse the error, even if it is in a nested HTTP Response, forward an
 * appropriate message via our ClientLogger, and show a JavaScript alert()
 * with the parsed error message.
 *
 * @param context       Context in which this error occurred
 * @param error         The object received by a "catch" block
 * @param details       Details to include in the logger message
 * @param alertPopup    Pop up a browser alert? [true]
 */
export const ReportError = (context: string, error: any, details: object = {}, alertPopup: boolean = true) => {
    let outMessage: string = error.message;
    let outData: any | undefined = undefined;
    if (error.response) {
        const errorResponse: any = error.response;
        if (errorResponse["data"]) {
            outData = errorResponse["data"];
            if (outData["message"]) {
                outMessage = outData["message"];
            }
        }
    }
    logger.error({
        context: context,
        msg: outMessage,
        details: details,
        error: outData ? outData : null,
    });
    // Give the logger a chance to forward before alert() stops everything
    if (alertPopup) {
        setTimeout(function() { alert(`Error: '${outMessage}'`); }, 100);
    }
}

export default ReportError;

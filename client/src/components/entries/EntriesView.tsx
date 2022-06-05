// EntriesView ---------------------------------------------------------------

// List of Entries belonging to the currently selected List.

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

import EntriesHeader from "./EntriesHeader";
import EntriesList from "./EntriesList";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const EntriesView = (props: Props) => {

    return (
        <>
            <EntriesHeader/>
            <EntriesList/>
        </>
    )

}

export default EntriesView;

// ItemsView ------------------------------------------------------------

// List of Items belonging to the currently selected List.

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

import ItemsHeader from "./ItemsHeader";
import ItemsList from "./ItemsList";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const ItemsView = (props: Props) => {

    return (
        <>
            <ItemsHeader/>
            <ItemsList/>
        </>
    )

}

export default ItemsView;

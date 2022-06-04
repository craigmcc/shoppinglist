// CategoriesView ------------------------------------------------------------

// List of Categories belonging to the currently selected List.

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

import CategoriesHeader from "./CategoriesHeader";
import CategoriesList from "./CategoriesList";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const CategoriesView = (props: Props) => {

    return (
        <>
            <CategoriesHeader/>
            <CategoriesList/>
        </>
    )

}

export default CategoriesView;

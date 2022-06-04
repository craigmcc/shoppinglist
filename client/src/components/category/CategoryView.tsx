// CategoryView --------------------------------------------------------------

// Supports editing of a new or existing Category.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import CategoryForm from "./CategoryForm";
import CategoryHeader from "./CategoryHeader";
import {CURRENT_CATEGORY_KEY, CURRENT_LIST_KEY} from "../../constants";
import {HandleCategory} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import useMutateCategory from "../../hooks/useMutateCategory";
import Category from "../../models/Category";
import List from "../../models/List";
import logger from "../../util/ClientLogger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const CategoryView = (props: Props) => {

    const [category] = useLocalStorage<Category>(CURRENT_CATEGORY_KEY);
    const [list] = useLocalStorage<List>(CURRENT_LIST_KEY);

    const mutateCategory = useMutateCategory({
        alertPopup: true,
        list: list,
    });
    const navigate = useNavigate();

    useEffect(() => {
        logger.debug({
            context: "CategoryView.useEffect",
            list: list,
            category: category,
        });
    }, [category, list]);

    const handleSave: HandleCategory = async (theCategory) => {
        // TODO - mutating progess?
        try {
            let saved: Category;
            if (theCategory.id) {
                saved = await mutateCategory.update(theCategory);
            } else {
                saved = await mutateCategory.insert(theCategory);
            }
            logger.debug({
                context: "CategoryView.handleSave",
                category: saved,
            });
        } catch (error) {
            ReportError("CategoryView.handleSave", error, {
                category: theCategory,
            });
        }
        navigate("/categories");
    }

    return (
        <>
            {(category) ? (
                <>
                    <CategoryHeader category={category}/>
                    <CategoryForm
                        autoFocus
                        category={category}
                        handleSave={handleSave}
                    />
                </>
            ) : null }
            <Outlet/>
        </>
    )

}

export default CategoryView;

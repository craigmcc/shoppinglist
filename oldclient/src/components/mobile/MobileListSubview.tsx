// MobileListSubview ---------------------------------------------------------

// Subview displayed to logged-in User for managing Lists

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import {MutatingProgress} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import MobileCategorySubview from "./MobileCategorySubview";
import ListForm from "../lists/ListForm";
import ListList from "../lists/ListList";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleList} from "../../types";
import useMutateList from "../../hooks/useMutateList";
import List from "../../models/List";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
}

// Component Details -------------------------------------------------------

const MobileListSubview = (props: Props) => {

    enum View {
        CATEGORIES = "Categories",
        FORM = "Form",
        LIST = "List",
    }

    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [list, setList] = useState<List>(new List());
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.LIST);

    const mutateList = useMutateList({
        alertPopup: false,
    });

    useEffect(() => {
        logger.info({
            context: "MobileListsView.useEffect",
            loggedIn: loginContext.data.loggedIn,
            username: loginContext.data.username,
            view: view.toString(),
        });
        setCanInsert(true);
        setCanRemove(list.admin);
        setCanUpdate(true);
    }, [loginContext.data.loggedIn, loginContext.data.username,
        list.admin, view]);

    // Create an empty List to be added
    const handleAdd: HandleAction = () => {
        const theList = new List({
            active: true,
            name: null,
            notes: null,
            theme: null,
        });
        logger.debug({
            context: "MobileListSubview.handleAdd",
            list: theList,
        });
        setList(theList);
        setView(View.FORM);
    }

    // Handle returning to the previous view
    const handleBack: HandleAction = () => {
        setView(View.LIST);
    }

    // Handle selection of a List to edit details
    const handleEdit: HandleList = (theList) => {
        logger.debug({
            context: "MobileListsView.handleEdit",
            list: Abridgers.LIST(theList),
        });
        setList(theList);
        setView(View.FORM);
    }

    // Handle insert of a new List
    const handleInsert: HandleList = async (theList) => {
        setMessage(`Inserting List '${theList.name}'`);
        const inserted = await mutateList.insert(theList);
        logger.debug({
            context: "MobileListSubview.handleInsert",
            list: Abridgers.LIST(inserted),
        });
        setView(View.LIST);
    }

    // Handle remove of an existing List
    const handleRemove: HandleList = async (theList) => {
        setMessage(`Removing List '${theList.name}'`);
        const removed = await mutateList.remove(theList);
        logger.debug({
            context: "MobileListSubview.handleRemove",
            list: Abridgers.LIST(removed),
        });
        setView(View.LIST);
    }

    // Handle return to this subview
    const handleReturn: HandleAction = () => {
        setView(View.LIST);
    }

    // Handle selection of a List to manage Categories
    const handleSelect: HandleList = (theList) => {
        setList(theList);
        setView(View.CATEGORIES);
    }

    // Handle share of a List
    const handleShare: HandleList = (theList) => {
        alert("handleShare() has not yet been implemented");
    }

    // Handle update of an existing List
    const handleUpdate: HandleList = async (theList) => {
        setMessage(`Updating List '${theList.name}'`);
        const updated = await mutateList.update(theList);
        logger.debug({
            context: "MobileListSubview.handleUpdate",
            list: Abridgers.LIST(updated),
        });
        setView(View.LIST);
    }

    return (
        <>

            <MutatingProgress
                error={mutateList.error}
                executing={mutateList.executing}
                message={message}
            />

            {(view === View.CATEGORIES) ? (
                <MobileCategorySubview
                    handleReturn={handleReturn}
                    list={list}
                />
            ) : null }

            {(view === View.FORM) ? (
                <ListForm
                    autoFocus={true}
                    handleBack={handleBack}
                    handleInsert={(canInsert) ? handleInsert : undefined}
                    handleRemove={(canRemove) ? handleRemove : undefined}
                    handleUpdate={(canUpdate) ? handleUpdate : undefined}
                    list={list}
                />
            ) : null }

            {(view === View.LIST) ? (
                <ListList
                    handleAdd={(canInsert) ? handleAdd : undefined}
                    handleEdit={(canUpdate) ? handleEdit : undefined}
                    handleSelect={handleSelect}
                    handleShare={handleShare}
                />
            ) : null }

        </>
    )

}

export default MobileListSubview;

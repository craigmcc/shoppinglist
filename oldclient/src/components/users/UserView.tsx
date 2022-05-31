// UserView -----------------------------------------------------------------

// Top-level view for managing User objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import {MutatingProgress} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import UserForm from "./UserForm";
import UserList from "./UserList";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleUser, Scope} from "../../types";
import useMutateUser from "../../hooks/useMutateUser";
import User from "../../models/User";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    FORM = "Form",
    LIST = "List",
}

const UserView = () => {

    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<User>(new User());
    const [view, setView] = useState<View>(View.LIST);

    const mutateUser = useMutateUser({
        alertPopup: false,
    });

    useEffect(() => {

        logger.debug({
            context: "UserView.useEffect",
            view: view.toString(),
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isSuperuser);

    }, [loginContext,
        view]);

    // Create an empty User to be added
    const handleAdd: HandleAction = () => {
        const theUser = new User({
            active: true,
            email: null,
            firstName: null,
            lastName: null,
            password: null,
            scope: null,
            username: null,
        });
        logger.debug({
            context: "UserView.handleAdd",
            user: theUser,
        });
        setUser(theUser);
        setView(View.FORM);
    }

    // Handle returning to the previous view
    const handleBack: HandleAction = () => {
        setView(View.LIST);
    }

    // Handle selection of a User to edit details
    const handleEdit: HandleUser = (theUser) => {
        logger.debug({
            context: "UserView.handleEdit",
            user: Abridgers.USER(theUser),
        });
        setUser(theUser);
        setView(View.FORM);
    }

    // Handle insert of a new User
    const handleInsert: HandleUser = async (theUser) => {
        setMessage(`Inserting User '${theUser.username}'`);
        const inserted = await mutateUser.insert(theUser);
        logger.debug({
            context: "UserView.handleInsert",
            user: Abridgers.USER(inserted),
        });
        setView(View.LIST);
    }

    // Handle remove of an existing User
    const handleRemove: HandleUser = async (theUser) => {
        setMessage(`Removing User '${theUser.username}'`);
        const removed = await mutateUser.remove(theUser);
        logger.debug({
            context: "UserView.handleRemove",
            user: Abridgers.USER(removed),
        });
        setView(View.LIST);
    }

    // Handle update of an existing User
    const handleUpdate: HandleUser = async (theUser) => {
        setMessage(`Updating User '${theUser.username}'`);
        const updated = await mutateUser.update(theUser);
        logger.debug({
            context: "UserView.handleUpdate",
            user: Abridgers.USER(updated),
        });
        setView(View.LIST);
    }

    return (
        <>

            <MutatingProgress
                error={mutateUser.error}
                executing={mutateUser.executing}
                message={message}
            />

            {(view === View.FORM) ? (
                <UserForm
                    autoFocus={true}
                    handleBack={handleBack}
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    user={user}
                />
            ) : null }

            {(view === View.LIST) ? (
                <UserList
                    handleAdd={canInsert ? handleAdd : undefined}
                    handleEdit={canUpdate ? handleEdit : undefined}
                />
            ) : null }

        </>
    )

}

export default UserView;


// types ---------------------------------------------------------------------

// Typescript type definitions for client application components.

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

import Category from "./models/Category";
import CreateAccount from "./models/CreateAccount";
import Credentials from "./models/Credentials";
import Item from "./models/Item";
import List from "./models/List";
import Password from "./models/Password";
import Share from "./models/Share";
import User from "./models/User";

// Enumerations --------------------------------------------------------------

// Logging levels
export enum Level {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

// OAuth scopes
export enum Scope {
    ADMIN = "admin",
    ANY = "any",
    REGULAR = "regular",
    SUPERUSER = "superuser",
}

// Login Data ----------------------------------------------------------------

// Data that is visible to HTTP clients not part of the React component hierarchy
export interface LoginData {
    accessToken: string | null;         // Current access token (if logged in)
    expires: Date | null;               // Absolute expiration time (if logged in)
    loggedIn: boolean;                  // Is user currently logged in?
    refreshToken: string | null;        // Current refresh token (if logged in and returned)
    scope: string | null;               // Allowed scope(s) (if logged in)
    username: string | null;            // Logged in username (if logged in)
}

// HTML Event Handlers -------------------------------------------------------

export type OnAction = () => void; // Nothing to pass, just trigger action
export type OnBlur = (event: React.FocusEvent<HTMLElement>) => void;
export type OnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type OnChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => void;
export type OnChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type OnClick = (event: React.MouseEvent<HTMLElement>) => void;
export type OnFocus = (event: React.FocusEvent<HTMLElement>) => void;
export type OnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => void;

// Miscellaneous Handlers ----------------------------------------------------

export type HandleAction = () => void; // Synonym for OnAction
export type HandleBoolean = (newBoolean: boolean) => void;
export type HandleDate = (date: string) => void;
export type HandleIndex = (newIndex: number) => void;
export type HandleMonth = (month: string) => void;
export type HandleResults = () => Promise<object>;
export type HandleValue = (newValue: string) => void;

// Model Object Handlers -----------------------------------------------------

export type HandleCategory = (category: Category) => void;
export type HandleCreateAccount = (createAccount: CreateAccount) => void;
export type HandleCredentials = (credentials: Credentials) => void;
export type HandleItem = (item: Item) => void;
export type HandleList = (list: List) => void;
export type HandlePassword = (password: Password) => void;
export type HandleShare = (share: Share) => void;
export type HandleUser = (user: User) => void;

export type ProcessCategory = (category: Category) => Promise<Category>;
export type ProcessCreateAccount = (createAccount: CreateAccount) => Promise<User>;
export type ProcessCredentials = (credentials: Credentials) => Promise<Credentials>;
export type ProcessItem = (item: Item) => Promise<Item>;
export type ProcessList = (list: List) => Promise<List>;
export type ProcessPassword = (password: Password) => Promise<Password>;
export type ProcessShare = (share: Share) => Promise<Share>;
export type ProcessUser = (user: User) => Promise<User>;

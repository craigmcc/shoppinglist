// Navigation ----------------------------------------------------------------

// Top-level navigation menu, with support for react-router-dom@6.

// External Modules ----------------------------------------------------------

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import {NavLink, Outlet} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoggedInUser from "../login/LoggedInUser";

// Component Details ---------------------------------------------------------

function Navigation () {

    return(
        <>
            <Navbar
                bg="light"
                className="mb-3"
                collapseOnSelect
                sticky="top"
                variant="light"
            >

                <Navbar.Brand>
                    <span className="ms-2"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                         className="bi bi-card-checklist" viewBox="0 0 16 16">
                        <path
                            d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                        <path
                            d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    <span className="ms-2">Shopping List</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <NavLink className="nav-link" to="/">Home</NavLink>
                        <NavLink className="nav-link" to="/view-mobile">Mobile</NavLink>
                        <NavLink className="nav-link" to="/view-web">Web</NavLink>
                        <NavDropdown title="Admin">
                            <NavDropdown.Item>
                                <NavLink className="nav-link" to="/admin-users">Users</NavLink>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <LoggedInUser/>
                    <span className="me-2"/>
                </Navbar.Collapse>

            </Navbar>
            <Outlet/>

        </>
    )

}

export default Navigation;

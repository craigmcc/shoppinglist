// Navigation ----------------------------------------------------------------

// Top-level navigation menu, with support for react-router-dom@6.

// External Modules ----------------------------------------------------------

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import {CardChecklist} from "react-bootstrap-icons";
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
                    <CardChecklist size={48}/>
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

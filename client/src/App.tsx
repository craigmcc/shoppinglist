// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import Container from "react-bootstrap/Container";
import {isMobile} from "react-device-detect";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Internal Modules ----------------------------------------------------------

import HomeView from "./components/general/HomeView";
import Navigation from "./components/general/Navigation";
import {LoginContextProvider} from "./components/login/LoginContext";
import MobileView from "./components/mobile/MobileView";
import UsersView from "./components/users/UsersView";
import WebView from "./components/web/WebView";

// Component Details ---------------------------------------------------------

function App () {

    return (
        <>

            <ToastContainer
                autoClose={5000}
                closeOnClick={true}
                draggable={false}
                hideProgressBar={false}
                newestOnTop={false}
                position="top-right"
                theme="colored"
            />

            <LoginContextProvider>
                {(isMobile) ? (
                    <MobileView/>
                ) : (
                    <Router>
                        <Routes>
                            <Route path="/" element={<Navigation/>}>
                                <Route path="admin-users" element={<UsersView/>}/>
                                <Route path="view-mobile" element={
                                    <Container style={{ border: "2px solid black", height: "667pt", width: "375pt" }}>
                                        <MobileView/>
                                    </Container>
                                }/>
                                <Route path="view-web" element={<WebView/>}/>
                                <Route path="" element={<HomeView/>}/>
                            </Route>
                        </Routes>
                    </Router>
                )}
            </LoginContextProvider>

        </>
    );
}

export default App;

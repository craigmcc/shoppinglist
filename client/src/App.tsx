// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Internal Modules ----------------------------------------------------------

import {LoginContextProvider} from "./components/login/LoginContext";
import HomeView from "./components/home/HomeView";
import ProfileView from "./components/profile/ProfileView";

// Component Details ---------------------------------------------------------

function App() {

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
            <Router>
                <Routes>
                    <Route path="/">
                        <Route path="" element={<HomeView/>}/>
                        <Route path="/profile" element={<ProfileView/>}/>
                    </Route>
                </Routes>
            </Router>
        </LoginContextProvider>

      </>
  );

}

export default App;

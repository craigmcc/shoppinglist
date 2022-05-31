// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import {ToastContainer} from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Internal Modules ----------------------------------------------------------

import {LoginContextProvider} from "./components/login/LoginContext";

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
          <div className="App">
            <header className="App-header">
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        </LoginContextProvider>

      </>
  );

}

export default App;

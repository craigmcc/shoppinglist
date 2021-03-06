// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import {HashRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Internal Modules ----------------------------------------------------------

import {LoginContextProvider} from "./components/login/LoginContext";
import AcceptView from "./components/accept/AcceptView";
import CategoriesView from "./components/categories/CategoriesView";
import CategoryView from "./components/category/CategoryView";
import EntriesView from "./components/entries/EntriesView";
import HomeView from "./components/home/HomeView";
import ItemView from "./components/item/ItemView";
import ItemsView from "./components/items/ItemsView";
import ListView from "./components/list/ListView";
import ListsView from "./components/lists/ListsView";
import PasswordView from "./components/password/PasswordView";
import ProfileView from "./components/profile/ProfileView";
import RegisterView from "./components/register/RegisterView";
import ResetView from "./components/reset/ResetView";
import ShareView from "./components/share/ShareView";

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
                        <Route path="accept">
                            <Route path=":shareId" element={<AcceptView/>}/>
                        </Route>
                        <Route path="categories" element={<CategoriesView/>}/>
                        <Route path="category" element={<CategoryView/>}/>
                        <Route path="entries" element={<EntriesView/>}/>
                        <Route path="item" element={<ItemView/>}/>
                        <Route path="items" element={<ItemsView/>}/>
                        <Route path="list" element={<ListView/>}/>
                        <Route path="lists" element={<ListsView/>}/>
                        {/* PasswordView supports both with and without passwordId */}
                        <Route path="passwords" element={<PasswordView/>}>
                            <Route path=":passwordId" element={<PasswordView/>}/>
                        </Route>
                        <Route path="profile" element={<ProfileView/>}/>
                        <Route path="register" element={<RegisterView/>}/>
                        <Route path="reset" element={<ResetView/>}/>
                        <Route path="share" element={<ShareView/>}/>
                    </Route>
                </Routes>
            </Router>
        </LoginContextProvider>

      </>
  );

}

export default App;

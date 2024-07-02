import { React } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Login} />
                <Route path="/dashboard" Component={Dashboard} />
                <Route path="/manageusers" Component={ManageUsers} />

                {/* <Route Component={NotFound} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;

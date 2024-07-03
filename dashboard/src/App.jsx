import { React } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Ingredients from "./pages/Ingredients";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import AuditLog from "./pages/AuditLog";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Login} />
                <Route path="/dashboard" Component={Dashboard} />
                <Route path="/users" Component={Users} />
                <Route path="/ingredients" Component={Ingredients} />
                <Route path="/menu" Component={Menu} />
                <Route path="/order" Component={Order} />
                <Route path="/auditlog" Component={AuditLog} />

                {/* <Route Component={NotFound} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;

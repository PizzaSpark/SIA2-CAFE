import { React } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Menu from "./pages/Menu";
import Recipe from "./pages/Recipe";
import Order from "./pages/Order";
import AuditLog from "./pages/AuditLog";
import Stocks from "./pages/Stocks";
import Savemore from "./pages/Savemore";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import Signup from "./pages/Signup";
import Projects from "./pages/Projects";
import Transactions from "./pages/Transactions";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Login} />
                <Route path="/signup" Component={Signup} />
                <Route path="/dashboard" Component={Dashboard} />
                <Route path="/users" Component={Users} />
                <Route path="/stocks" Component={Stocks} />
                <Route path="/menu" Component={Menu} />
                <Route path="/recipe" Component={Recipe} />
                <Route path="/order" Component={Order} />
                <Route path="/savemore" Component={Savemore} />
                <Route path="/transactions" Component={Transactions} />
                <Route path="/auditlog" Component={AuditLog} />
                <Route path="/partners" Component={Projects} />

                <Route path="/forbidden" Component={Forbidden} />
                <Route path="*" Component={NotFound} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { React, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {

    return (
        <Router>
            <Route>
                <Switch path="/" component={Login} />
                <Switch path="/dashboard" component={Dashboard} />
                
                {/* <Route component={NotFound} /> */}
            </Route>
        </Router>
    );
}

export default App;

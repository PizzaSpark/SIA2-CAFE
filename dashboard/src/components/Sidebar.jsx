import React from "react";
import "../styles/Sidebar.css";
import { useNavigate, NavLink } from "react-router-dom";
import {
    BarChart,
    Category,
    Inventory,
    Logout,
    MenuBook,
    People,
    SpaceDashboard,
} from "@mui/icons-material";

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar">
                <h1>Cafe</h1>
                <div className="sidebar-items">
                    <SidebarLink
                        to="/dashboard"
                        Icon={SpaceDashboard}
                        label="Dashboard"
                    />

                    <SidebarLink
                        to="/manageusers"
                        Icon={People}
                        label="Manage Users"
                    />

                    <SidebarLink
                        to="/manageinventory"
                        Icon={Inventory}
                        label="Manage Ingredients"
                    />

                    <SidebarLink
                        to="/manageproducts"
                        Icon={MenuBook}
                        label="Manage Menu"
                    />

                    <SidebarLink
                        to="/"
                        Icon={Logout}
                        label="Logout"
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ to, label, Icon, onClick }) {
    return (
        <NavLink to={to} onClick={onClick}>
            <div className="tilecontent">
                <Icon />
                <p>{label}</p>
            </div>
        </NavLink>
    );
}

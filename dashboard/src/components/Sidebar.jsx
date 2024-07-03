import React from "react";
import "../styles/Sidebar.css";
import { useNavigate, NavLink } from "react-router-dom";
import {
    BarChart,
    Category,
    FormatListBulleted,
    Inventory,
    Logout,
    MenuBook,
    People,
    ShoppingBag,
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
                        to="/users"
                        Icon={People}
                        label="Users"
                    />

                    <SidebarLink
                        to="/ingredients"
                        Icon={Inventory}
                        label="Ingredients"
                    />

                    <SidebarLink
                        to="/menu"
                        Icon={MenuBook}
                        label="Menu"
                    />

                    <SidebarLink
                        to="/order"
                        Icon={ShoppingBag}
                        label="Order Here"
                    />

                    <SidebarLink
                        to="/auditlog"
                        Icon={FormatListBulleted}
                        label="Audit Log"
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

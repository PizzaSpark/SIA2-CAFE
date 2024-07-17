import React from "react";
import "../../styles/Sidebar.css";
import { useNavigate, NavLink } from "react-router-dom";
import {
    AddShoppingCart,
    FormatListBulleted,
    Inventory,
    Logout,
    MenuBook,
    People,
    RestaurantMenu,
    ShoppingBag,
    SpaceDashboard,
} from "@mui/icons-material";
import CafeReyesImage from "../../assets/CafeReyes.svg";

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Retrieve the user's role from localStorage
    const userRole = localStorage.getItem("role");

    // Define the access control for each route
    const accessControl = {
        '/dashboard': ['Admin', 'Owner', 'Staff', 'Customer'],
        '/users': ['Admin', 'Owner'],
        '/stocks': ['Admin', 'Owner'],
        '/menu': ['Admin', 'Owner'],
        '/recipe': ['Admin', 'Owner'],
        '/order': ['Admin', 'Owner', 'Staff', 'Customer'],
        '/savemore': ['Admin', 'Owner'],
        '/auditlog': ['Admin', 'Owner', 'Staff'],
    };

    // Check if the user's role is allowed for a given route
    const isAllowed = (route) => accessControl[route]?.includes(userRole);

    return (
        <div className="sidebar-container">
            <div className="sidebar">
                <div style={{ width: "50%", margin: "0 auto 16px" }}>
                    <img
                        src={CafeReyesImage}
                        alt="Forbidden Access"
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                        }}
                    />
                </div>
                <div className="sidebar-items">
                    {isAllowed('/dashboard') && <SidebarLink to="/dashboard" Icon={SpaceDashboard} label="Dashboard" />}
                    {isAllowed('/users') && <SidebarLink to="/users" Icon={People} label="Users" />}
                    {isAllowed('/stocks') && <SidebarLink to="/stocks" Icon={Inventory} label="Stocks" />}
                    {isAllowed('/menu') && <SidebarLink to="/menu" Icon={MenuBook} label="Menu" />}
                    {isAllowed('/recipe') && <SidebarLink to="/recipe" Icon={RestaurantMenu} label="Recipe" />}
                    {isAllowed('/order') && <SidebarLink to="/order" Icon={ShoppingBag} label="Cafe POS" />}
                    {isAllowed('/auditlog') && <SidebarLink to="/auditlog" Icon={FormatListBulleted} label="Audit Log" />}
                    {isAllowed('/savemore') && <SidebarLink to="/savemore" Icon={AddShoppingCart} label="Savemore" />}
                    <SidebarLink to="/" Icon={Logout} label="Logout" onClick={handleLogout} />
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
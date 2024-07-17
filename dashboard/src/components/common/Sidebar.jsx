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
import CafeReyesImage from "../../assets/CafeReyes.png";

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

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
                    <SidebarLink
                        to="/dashboard"
                        Icon={SpaceDashboard}
                        label="Dashboard"
                    />

                    <SidebarLink to="/users" Icon={People} label="Users" />

                    <SidebarLink to="/stocks" Icon={Inventory} label="Stocks" />

                    <SidebarLink to="/menu" Icon={MenuBook} label="Menu" />

                    <SidebarLink
                        to="/recipe"
                        Icon={RestaurantMenu}
                        label="Recipe"
                    />

                    <SidebarLink
                        to="/order"
                        Icon={ShoppingBag}
                        label="Cafe POS"
                    />

                    <SidebarLink
                        to="/auditlog"
                        Icon={FormatListBulleted}
                        label="Audit Log"
                    />

                    <SidebarLink
                        to="/savemore"
                        Icon={AddShoppingCart}
                        label="Savemore"
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

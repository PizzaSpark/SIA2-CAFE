import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
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
import { pageAccessRules } from '../../config/pageAccessRules';
import CafeReyesImage from "../../assets/CafeReyes.svg";
import "../../styles/Sidebar.css";

export default function Sidebar() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const userId = localStorage.getItem("_id");
                const response = await axios.get(`${VITE_REACT_APP_API_HOST}/api/users/${userId}`);
                setUserRole(response.data.role);
            } catch (error) {
                console.error("Failed to fetch user role:", error);
            }
        };

        fetchUserRole();
    }, [VITE_REACT_APP_API_HOST]);

    const handleLogout = async () => {
        try {
            const userId = localStorage.getItem("_id");
            
            // Create audit log
            await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/audits`,
                {
                    action: "USER LOGOUT",
                    user: userId,
                    details: `User signed out`
                }
            );
        } catch (error) {
            console.error("Failed to create audit log:", error);
        } finally {
            // Clear localStorage and navigate regardless of audit log success
            localStorage.clear();
            navigate("/", { replace: true });
        }
    };

    // Check if the user's role is allowed for a given route
    const isAllowed = (route) => pageAccessRules[route]?.includes(userRole);

    return (
        <div className="sidebar-container">
            <div className="sidebar">
                <div style={{ width: "50%", margin: "0 auto 16px" }}>
                    <img
                        src={CafeReyesImage}
                        alt="Cafe Reyes Logo"
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
import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Dashboard,
    People,
    Inventory,
    MenuBook,
    Restaurant,
    ShoppingCart,
    ListAlt,
    Receipt,
    Logout,
} from "@mui/icons-material";
import { pageAccessRules } from "../../config/pageAccessRules";
import CafeReyesImage from "../../assets/CafeReyes.svg";

const menuItems = [
    { name: "Dashboard", icon: Dashboard, route: "/dashboard" },
    { name: "Users", icon: People, route: "/users" },
    { name: "Stocks", icon: Inventory, route: "/stocks" },
    { name: "Menu", icon: MenuBook, route: "/menu" },
    { name: "Recipe", icon: Restaurant, route: "/recipe" },
    { name: "Order", icon: ShoppingCart, route: "/order" },
    { name: "Savemore", icon: ListAlt, route: "/savemore" },
    { name: "Auditlog", icon: Receipt, route: "/auditlog" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem("_id");
                const response = await axios.get(
                    `${VITE_REACT_APP_API_HOST}/api/users/${userId}`
                );
                setUserRole(response.data.role);
                setUserName(response.data.name);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, [VITE_REACT_APP_API_HOST]);

    const handleLogout = async () => {
        try {
            const userId = localStorage.getItem("_id");
            await axios.post(`${VITE_REACT_APP_API_HOST}/api/audits`, {
                action: "USER LOGOUT",
                user: userId,
                details: `User signed out`,
            });
        } catch (error) {
            console.error("Failed to create audit log:", error);
        } finally {
            localStorage.clear();
            navigate("/", { replace: true });
        }
    };

    const isAllowed = (route) => pageAccessRules[route]?.includes(userRole);

    return (
        <Box
            sx={{
                width: 280,
                height: "100vh",
                bgcolor: "#F8F0F0",
                display: "flex",
                flexDirection: "column",
                borderTopRightRadius: 30,
                borderBottomRightRadius: 30,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img
                    src={CafeReyesImage}
                    alt="Cafe Reyes Logo"
                    style={{ width: "80%", height: "auto" }}
                />
            </Box>
            <List sx={{ flex: 1, py: 0 }}>
                {menuItems.map(
                    (item) =>
                        isAllowed(item.route) && (
                            <ListItem
                                key={item.name}
                                component={NavLink}
                                to={item.route}
                                sx={{
                                    color: "#644F4F",
                                    transition: "all 0.3s",
                                    "&.active": {
                                        bgcolor: "#F2D5D5",
                                        color: "#3E2929",
                                        "& .MuiListItemIcon-root": {
                                            color: "#3E2929",
                                        },
                                        borderRight: "4px solid #B17A7A",
                                    },
                                    "&:hover:not(.active)": {
                                        bgcolor: "#FCE8E8",
                                        color: "#4A3636",
                                        "& .MuiListItemIcon-root": {
                                            color: "#4A3636",
                                        },
                                        paddingLeft: "24px",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{ color: "inherit", minWidth: 40 }}
                                >
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItem>
                        )
                )}
            </List>
            <Box
                sx={{
                    p: 2,
                    borderTop: "1px solid #E0D0D0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Typography
                        variant="caption"
                        sx={{ color: "#644F4F", display: "block" }}
                    >
                        Welcome back,
                    </Typography>
                    <Tooltip title={`Role: ${userRole}`} placement="top">
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#3E2929", fontWeight: "bold", cursor: "help" }}
                        >
                            {userName}
                        </Typography>
                    </Tooltip>
                </Box>
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        color: "#644F4F",
                        "&:hover": {
                            bgcolor: "#FCE8E8",
                            color: "#4A3636",
                        },
                    }}
                >
                    <Logout />
                </IconButton>
            </Box>
        </Box>
    );
}
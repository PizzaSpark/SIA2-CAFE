import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

export default function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    };

    return (
        <div className="page">
            <div className="page-content">
                <div className="space-between">
                    <h1>Dashboard</h1>
                    <IconButton
                        onClick={handleLogout}
                        style={{ fontSize: "2em" }}
                    >
                        <AccountCircle
                            className="actionicon"
                            style={{ fontSize: "2em" }}
                        />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

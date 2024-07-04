import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { Button } from "@mui/material";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

export default function Stocks() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Ingredients</h1>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                >
                    Create Stock
                </Button>
                <UserTable users={users} onEdit={handleEdit} />
                <UserForm
                    open={open}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                    userToEdit={userToEdit}
                />
            </div>
        </div>
    );
}

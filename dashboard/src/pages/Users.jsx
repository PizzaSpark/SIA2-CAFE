import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { Button } from "@mui/material";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import { useRoleCheck } from "../hooks/useRoleCheck";
import PasswordResetDialog from "../components/PasswordResetDialog";

export default function Users() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = "users";
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [passwordResetOpen, setPasswordResetOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useRoleCheck();

    useEffect(() => {
        axios
            .get(`${VITE_REACT_APP_API_HOST}/api/${resourceName}`)
            .then((response) => {
                setDataList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching dataList:", error);
                setDataList([]);
            });
    }, []);

    const handleCreate = () => {
        setDataToEdit(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = (formData) => {
        if (dataToEdit) {
            // Update user
            axios
                .put(
                    `${VITE_REACT_APP_API_HOST}/api/${resourceName}/${dataToEdit._id}`,
                    formData
                )
                .then((response) => {
                    setDataList((prevDataList) =>
                        prevDataList.map((item) =>
                            item._id === dataToEdit._id ? response.data : item
                        )
                    );
                    setOpen(false);

                    axios.post(
                        `${VITE_REACT_APP_API_HOST}/api/audits`,
                        {
                            action: "UPDATED USER",
                            user: localStorage.getItem("_id"),
                            details: `Successfully updated user with ID: ${dataToEdit._id}`
                        }
                    );
                })
                .catch((error) => {
                    console.error("Error updating user:", error);
                });
        } else {
            // Add new user
            axios
                .post(
                    `${VITE_REACT_APP_API_HOST}/api/${resourceName}`,
                    formData
                )
                .then((response) => {
                    setDataList((prevDataList) => [
                        ...prevDataList,
                        response.data,
                    ]);
                    setOpen(false);

                    axios.post(
                        `${VITE_REACT_APP_API_HOST}/api/audits`,
                        {
                            action: "ADDED USER",
                            user: localStorage.getItem("_id"),
                            details: `Successfully added new item with ID: ${response.data._id}`
                        }
                    );
                })
                .catch((error) => {
                    console.error("Error adding user:", error);
                });
        }
    };

    const handleEdit = (item) => {
        setDataToEdit(item);
        setOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axios
                .delete(`${VITE_REACT_APP_API_HOST}/api/${resourceName}/${id}`)
                .then((response) => {
                    setDataList((prevDataList) =>
                        prevDataList.filter((item) => item._id !== id)
                    );

                    axios.post(
                        `${VITE_REACT_APP_API_HOST}/api/audits`,
                        {
                            action: "DELETED USER",
                            user: localStorage.getItem("_id"),
                            details: `Successfully deleted item with ID: ${id}`
                        }
                    );
                })
                .catch((error) => {
                    console.error("Failed to delete user:", error);
                });
        }
    };

    const handlePasswordResetClick = (id) => {
        setSelectedUserId(id);
        setPasswordResetOpen(true);
    };

    const handlePasswordResetClose = () => {
        setPasswordResetOpen(false);
        setSelectedUserId(null);
    };

    const handlePasswordResetSubmit = (newPassword) => {
        axios
            .post(`${VITE_REACT_APP_API_HOST}/api/${resourceName}/${selectedUserId}/reset-password`, { newPassword })
            .then((response) => {
                alert("Password reset successful.");
                
                axios.post(
                    `${VITE_REACT_APP_API_HOST}/api/audits`,
                    {
                        action: "RESET PASSWORD",
                        user: localStorage.getItem("_id"),
                        details: `Successfully reset password for user with ID: ${selectedUserId}`
                    }
                );
            })
            .catch((error) => {
                console.error("Failed to reset password:", error);
                alert("Failed to reset password. Please try again.");
            })
            .finally(() => {
                handlePasswordResetClose();
            });
    };

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Users</h1>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                >
                    Create User
                </Button>
                <UserTable
                    dataList={dataList}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPasswordReset={handlePasswordResetClick}
                />
                <UserForm
                    open={open}
                    onClose={handleClose}
                    dataToEdit={dataToEdit}
                    onSubmit={handleSubmit}
                />
                <PasswordResetDialog
                    open={passwordResetOpen}
                    onClose={handlePasswordResetClose}
                    onSubmit={handlePasswordResetSubmit}
                />
            </div>
        </div>
    );
}

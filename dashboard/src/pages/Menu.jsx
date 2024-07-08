import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { Button } from "@mui/material";
import MenuTable from "../components/MenuTable";

export default function Menu() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = "menuItems";
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(null);

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
            // Update
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
                })
                .catch((error) => {
                    console.error("Error updating:", error);
                });
        } else {
            // Add new
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
                })
                .catch((error) => {
                    console.error("Error adding:", error);
                });
        }
    };

    const handleEdit = (item) => {
        setDataToEdit(item);
        setOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            axios
                .delete(`${VITE_REACT_APP_API_HOST}/api/${resourceName}/${id}`)
                .then((response) => {
                    setDataList((prevDataList) =>
                        prevDataList.filter((item) => item._id !== id)
                    );
                })
                .catch((error) => {
                    console.error("Failed to delete user:", error);
                });
        }
    };

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Menu</h1>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                >
                    Create Menu Item
                </Button>

                <MenuTable
                    dataList={dataList}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}

import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { Button } from "@mui/material";
import RecipeTable from "../components/RecipeTable";
import RecipeForm from "../components/RecipeForm";

export default function Recipe() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = "recipes";
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(null);

    const [menuItems, setMenuItems] = useState([]);
    const [stocks, setStocks] = useState([]);

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

        axios
            .get(`${VITE_REACT_APP_API_HOST}/api/menuItems`)
            .then((response) => {
                setMenuItems(response.data);
            })
            .catch((error) => {
                console.error("Error fetching dataList:", error);
                setMenuItems([]);
            });

        axios
            .get(`${VITE_REACT_APP_API_HOST}/api/stocks`)
            .then((response) => {
                setStocks(response.data);
            })
            .catch((error) => {
                console.error("Error fetching dataList:", error);
                setStocks([]);
            });
    }, []);

    const handleCreate = () => {
        setDataToEdit(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = (formData) => {
        if (dataToEdit) {
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
        if (window.confirm("Are you sure you want to delete this stock?")) {
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
                <h1>Recipe</h1>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                >
                    Create Recipe
                </Button>
                <RecipeTable
                    dataList={dataList}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    menuItems={menuItems}
                    stocks={stocks}
                />
                <RecipeForm
                    open={open}
                    onClose={handleClose}
                    dataToEdit={dataToEdit}
                    onSubmit={handleSubmit}
                    menuItems={menuItems}
                    stocks={stocks}
                    dataList={dataList}
                />
            </div>
        </div>
    );
}

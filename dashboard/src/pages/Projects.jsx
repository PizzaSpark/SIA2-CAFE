import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { Button } from "@mui/material";
import { useRoleCheck } from "../hooks/useRoleCheck";
import ProjectsContainer from "../components/ProjectsContainer";
import ProjectForm from "../components/ProjectForm";

export default function Projects() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = 'projects';
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useRoleCheck();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("_id");
                const userResponse = await axios.get(`${VITE_REACT_APP_API_HOST}/api/users/${userId}`);
                const userRole = userResponse.data.role;
                setUserRole(userRole);

                // Fetch projects based on user role
                const projectsEndpoint = userRole === 'Admin' ? `${resourceName}/admin` : resourceName;
                const projectsResponse = await axios.get(`${VITE_REACT_APP_API_HOST}/api/${projectsEndpoint}`);
                setDataList(projectsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setDataList([]);
            }
        };

        fetchData();
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
                    console.error("Error updating project:", error);
                });
        } else {
            axios
                .post(`${VITE_REACT_APP_API_HOST}/api/${resourceName}`, formData)
                .then((response) => {
                    setDataList((prevDataList) => [...prevDataList, response.data]);
                    setOpen(false);
                })
                .catch((error) => {
                    console.error("Error adding project:", error);
                });
        }
    };

    const handleEdit = (item) => {
        setDataToEdit(item);
        setOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            axios
                .delete(`${VITE_REACT_APP_API_HOST}/api/${resourceName}/${id}`)
                .then((response) => {
                    setDataList((prevDataList) =>
                        prevDataList.filter((item) => item._id !== id)
                    );
                })
                .catch((error) => {
                    console.error("Failed to delete project:", error);
                });
        }
    };

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Project List</h1>

                {userRole && userRole !== 'Customer' && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                    >
                        Add Project
                    </Button>
                )}
                <ProjectsContainer 
                    dataList={dataList} 
                    host={VITE_REACT_APP_API_HOST}
                    userRole={userRole}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <ProjectForm
                    open={open}
                    onClose={handleClose}
                    dataToEdit={dataToEdit}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
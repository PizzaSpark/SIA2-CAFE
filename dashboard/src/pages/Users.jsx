import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { Button } from "@mui/material";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

export default function Users() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = 'users';
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(null);

    useEffect(() => {
      axios.get(`${VITE_REACT_APP_API_HOST}/api/${resourceName}`)
        .then((response) => {
          setDataList(response.data);
        })
        .catch((error) => {
          console.error('Error fetching dataList:', error);
          setDataList([]);
        });
    }, []);

    const handleOpen = () => {
        setDataToEdit(null);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = (formData) => {
      if (dataToEdit) {
        // Update user
        axios.put(`${VITE_REACT_APP_API_HOST}/api/${resourceName}/${dataToEdit._id}`, formData)
          .then((response) => {
            setDataList((prevDataList) =>
              prevDataList.map((item) =>
                item._id === dataToEdit._id ? response.data : item
              )
            );
            setOpen(false);
          })
          .catch((error) => {
            console.error('Error updating user:', error);
          });
      } else {
        // Add new user
        axios.post(`${VITE_REACT_APP_API_HOST}/api/${resourceName}`, formData)
          .then((response) => {
            setDataList((prevDataList) => [
              ...prevDataList,
              response.data,
            ]);
            setOpen(false);
          })
          .catch((error) => {
            console.error('Error adding user:', error);
          });
      }
    };

    const handleEdit = (item) => {
        setDataToEdit(item);
        setOpen(true);
    };

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Users</h1>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                >
                    Create User
                </Button>
                <UserTable dataList={dataList} onEdit={handleEdit} />
                <UserForm
                    open={open}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                    dataToEdit={dataToEdit}
                />
            </div>
        </div>
    );
}

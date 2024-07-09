import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import ProductsContainer from "../components/common/ProductsContainer";
import { Box } from "@mui/material";

export default function Order() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = "menuItems";
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        axios
            .get(`${VITE_REACT_APP_API_HOST}/api/${resourceName}`)
            .then((response) => {
                // Initialize each item with a quantity of 0
                const initializedData = response.data.map((item) => ({
                    ...item,
                    quantity: 0,
                }));
                setDataList(initializedData);
            })
            .catch((error) => {
                console.error("Error fetching dataList:", error);
                setDataList([]);
            });
    }, []);

    const handleAdd = (product) => {
        setDataList((prevList) =>
            prevList.map((item) =>
                item._id === product._id
                    ? { ...item, quantity: (item.quantity || 0) + 1 }
                    : item
            )
        );
    };

    const handleRemove = (product) => {
        setDataList((prevList) =>
            prevList.map((item) =>
                item._id === product._id && item.quantity > 0
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Order</h1>

                <Box sx={{ padding: 3, maxWidth: "1200px", margin: "0 auto" }}>
                    <ProductsContainer
                        dataList={dataList}
                        handleAdd={handleAdd}
                        handleRemove={handleRemove}
                        host={VITE_REACT_APP_API_HOST}
                    />
                </Box>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import ProductsContainer from "../components/common/ProductsContainer";
import OrderSummary from "../components/OrderSummary";
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

    const calculateTotal = () => {
        return dataList.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="page" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="page-content" style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ 
                    width: '75%', 
                    padding: 3, 
                    display: 'flex', 
                    flexDirection: 'column'
                }}>
                    <h1>Order</h1>
                    <ProductsContainer
                        dataList={dataList}
                        handleAdd={handleAdd}
                        handleRemove={handleRemove}
                        host={VITE_REACT_APP_API_HOST}
                    />
                </Box>
                <Box sx={{ 
                    width: '25%', 
                    backgroundColor: '#f5f5f5', 
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <OrderSummary 
                        items={dataList.filter(item => item.quantity > 0)}
                        total={calculateTotal()}
                    />
                </Box>
            </div>
        </div>
    );
}
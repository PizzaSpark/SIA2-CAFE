import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Switch, FormControlLabel, Typography, CircularProgress } from "@mui/material";
import Sidebar from "../components/common/Sidebar";
import { useRoleCheck } from "../hooks/useRoleCheck";
import TransactionsTable from "../components/TransactionsTable";

export default function Transactions() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = 'receipts';
    const [dataList, setDataList] = useState([]);
    const [showOnlyUserTransactions, setShowOnlyUserTransactions] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const userId = localStorage.getItem("_id");

    useRoleCheck();

    useEffect(() => {
        fetchUserRole();
    }, []);

    useEffect(() => {
        if (userRole) {
            fetchTransactions();
        }
    }, [showOnlyUserTransactions, userRole]);

    const fetchUserRole = async () => {
        try {
            const response = await axios.get(`${VITE_REACT_APP_API_HOST}/api/users/${userId}`);
            setUserRole(response.data.role);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching user role:", error);
            setIsLoading(false);
        }
    };

    const fetchTransactions = () => {
        axios
            .get(`${VITE_REACT_APP_API_HOST}/api/${resourceName}`)
            .then((response) => {
                let filteredData = response.data;
                if (showOnlyUserTransactions || userRole === 'Customer') {
                    filteredData = filteredData.filter(transaction => transaction.buyer === userId);
                }
                setDataList(filteredData);
            })
            .catch((error) => {
                console.error("Error fetching dataList:", error);
                setDataList([]);
            });
    };

    const handleSwitchChange = (event) => {
        setShowOnlyUserTransactions(event.target.checked);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">Transactions</Typography>
                    {userRole !== 'Customer' && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showOnlyUserTransactions}
                                    onChange={handleSwitchChange}
                                    name="showOnlyUserTransactions"
                                    color="primary"
                                />
                            }
                            label="Show only my transactions"
                        />
                    )}
                </Box>
                <TransactionsTable dataList={dataList} />
            </div>
        </div>
    );
}
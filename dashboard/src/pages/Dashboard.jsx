import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { useRoleCheck } from "../hooks/useRoleCheck";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";


export default function Dashboard() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = 'receipts';
    const [salesStats, setSalesStats] = useState({});
    const [topSellers, setTopSellers] = useState([]);
    useRoleCheck();

    useEffect(() => {
        const fetchSalesStats = async () => {
            try {
                const response = await axios.get(`${VITE_REACT_APP_API_HOST}/api/${resourceName}/stats`);
                setSalesStats(response.data);
            } catch (error) {
                console.error("Error fetching sales stats:", error);
            }
        };

        const fetchTopSellers = async () => {
            try {
                const response = await axios.get(`${VITE_REACT_APP_API_HOST}/api/${resourceName}/top`);
                setTopSellers(response.data);
            } catch (error) {
                console.error("Error fetching top sellers:", error);
            }
        };

        fetchSalesStats();
        fetchTopSellers();
    }, []);

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Dashboard</h1>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">Daily Orders</Typography>
                                <Typography variant="h2">{salesStats.dailyCount || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">Weekly Orders</Typography>
                                <Typography variant="h2">{salesStats.weeklyCount || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">Total Sales</Typography>
                                <Typography variant="h2">${salesStats.totalAmount?.toFixed(2) || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">Top 5 Sellers</Typography>
                                <ul>
                                    {topSellers.map((seller, index) => (
                                        <li key={index}>
                                            {seller._id} - {seller.totalSold} sold
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

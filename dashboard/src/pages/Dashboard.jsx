import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { useRoleCheck } from "../hooks/useRoleCheck";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    Box,
} from "@mui/material";

export default function Dashboard() {
    const navigate = useNavigate();
    useRoleCheck();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const [salesStats, setSalesStats] = useState(null);
    const [lowStocks, setLowStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [salesResponse, stocksResponse] = await Promise.all([
                axios.get(`${VITE_REACT_APP_API_HOST}/api/receipts/stats`),
                axios.get(`${VITE_REACT_APP_API_HOST}/api/stocks/low-stocks`)
            ]);
            setSalesStats(salesResponse.data);
            setLowStocks(stocksResponse.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <Sidebar />
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(price);
    };

    return (
        <div className="page">
            <Sidebar />
            <Box className="page-content" p={3}>
                <Typography variant="h4" gutterBottom>Dashboard</Typography>
                <Grid container spacing={3}>
                    {/* Summary Cards */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Today's Sales</Typography>
                                <Typography variant="h4">{formatPrice(salesStats?.today.totalIncome)}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {salesStats?.today.count} receipts
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>This Week's Sales</Typography>
                                <Typography variant="h4">{formatPrice(salesStats?.week.totalIncome)}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {salesStats?.week.count} receipts
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Low Stock Items</Typography>
                                <Typography variant="h4">{lowStocks.length}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    items below minimum
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top Selling Items */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Top 5 Selling Items</Typography>
                                <List>
                                    {salesStats?.topSellers.map((item, index) => (
                                        <ListItem key={index} divider={index !== salesStats.topSellers.length - 1}>
                                            <ListItemText
                                                primary={item._id}
                                                secondary={`Quantity: ${item.totalQuantity}, Total Sales: $${item.totalSales.toFixed(2)}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Low Stock Alert */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Low Stock Alert</Typography>
                                {lowStocks.length > 0 ? (
                                    <List>
                                        {lowStocks.map((stock, index) => (
                                            <ListItem key={index} divider={index !== lowStocks.length - 1}>
                                                <ListItemText
                                                    primary={stock.name}
                                                    secondary={`Quantity: ${stock.quantity}, Minimum: ${stock.minimum}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Alert severity="success">All stocks are above minimum levels.</Alert>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
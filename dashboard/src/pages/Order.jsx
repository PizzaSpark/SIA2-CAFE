import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import ProductsContainer from "../components/common/ProductsContainer";
import OrderSummary from "../components/common/OrderSummary";
import { Box } from "@mui/material";
import OrderConfirmation from "../components/common/OrderConfirmation";
import SuccessDialog from "../components/common/SuccessDialog";
import PaymentDialog from "../components/common/PaymentDialog";
import { useRoleCheck } from "../hooks/useRoleCheck";

export default function Order() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST, VITE_REACT_APP_UNIONBANK_TOKEN } = import.meta.env;
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    const [recipes, setRecipes] = useState({});
    const [stocks, setStocks] = useState({});

    useRoleCheck();

    useEffect(() => {
        Promise.all([
            axios.get(`${VITE_REACT_APP_API_HOST}/api/menuItems`),
            axios.get(`${VITE_REACT_APP_API_HOST}/api/recipes`),
            axios.get(`${VITE_REACT_APP_API_HOST}/api/stocks`)
        ]).then(([menuItemsResponse, recipesResponse, stocksResponse]) => {
            const initializedData = menuItemsResponse.data.map((item) => ({
                ...item,
                quantity: 0,
            }));
            setDataList(initializedData);

            const recipesMap = {};
            recipesResponse.data.forEach(recipe => {
                if (!recipesMap[recipe.menuItem]) {
                    recipesMap[recipe.menuItem] = [];
                }
                recipesMap[recipe.menuItem].push({
                    stockId: recipe.stock,
                    quantity: recipe.quantity
                });
            });
            setRecipes(recipesMap);

            const stocksMap = {};
            stocksResponse.data.forEach(stock => {
                stocksMap[stock._id] = stock.quantity;
            });
            setStocks(stocksMap);
        }).catch((error) => {
            console.error("Error fetching data:", error);
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
        return dataList.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const handlePlaceOrder = () => {
        const orderItems = dataList.filter(item => item.quantity > 0);
        let canFulfillOrder = true;
        const stockUpdates = {};

        orderItems.forEach(item => {
            const recipe = recipes[item._id];
            if (recipe) {
                recipe.forEach(ingredient => {
                    const requiredQuantity = ingredient.quantity * item.quantity;
                    const availableQuantity = stocks[ingredient.stockId] - (stockUpdates[ingredient.stockId] || 0);
                    if (availableQuantity < requiredQuantity) {
                        canFulfillOrder = false;
                    } else {
                        stockUpdates[ingredient.stockId] = (stockUpdates[ingredient.stockId] || 0) + requiredQuantity;
                    }
                });
            }
        });

        if (!canFulfillOrder) {
            alert("Not enough stock to fulfill the order.");
            return;
        }

        setOpenConfirmation(true);
    };

    const handleOrderConfirm = () => {
        setOpenConfirmation(false);
        setOpenPaymentDialog(true);
    };

    const handlePaymentConfirm = async (bankCredentials) => {
        const totalAmount = calculateTotal();

        try {
            const res = await axios.post(
                `http://192.168.10.14:3001/api/unionbank/transfertransaction`,
                {
                    debitAccount: bankCredentials,
                    creditAccount: "000000019",
                    amount: totalAmount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${VITE_REACT_APP_UNIONBANK_TOKEN}`,
                    },
                }
            );

            if (!res.data.success) {
                alert(res.data.message);
                return;
            }

            // Update stocks
            const orderItems = dataList.filter(item => item.quantity > 0);
            const stockUpdates = {};

            orderItems.forEach(item => {
                const recipe = recipes[item._id];
                if (recipe) {
                    recipe.forEach(ingredient => {
                        const requiredQuantity = ingredient.quantity * item.quantity;
                        stockUpdates[ingredient.stockId] = (stockUpdates[ingredient.stockId] || 0) + requiredQuantity;
                    });
                }
            });

            // Send stock updates to the server
            await axios.post(`${VITE_REACT_APP_API_HOST}/api/stocks/update-multiple`, stockUpdates);

            setReferenceId(res.data.reference);
            setSuccessDialogOpen(true);
            setOpenPaymentDialog(false);

            // Reset the cart
            setDataList((prevList) =>
                prevList.map((item) => ({ ...item, quantity: 0 }))
            );

            // Update local stock state
            setStocks(prevStocks => {
                const newStocks = { ...prevStocks };
                Object.entries(stockUpdates).forEach(([stockId, quantity]) => {
                    newStocks[stockId] -= quantity;
                });
                return newStocks;
            });

        } catch (error) {
            console.error("Error processing order:", error);
            alert("An error occurred while processing your order.");
        }
    };

    const handleClose = () => setOpenConfirmation(false);
    const handlePaymentDialogClose = () => setOpenPaymentDialog(false);
    const handleSuccessDialogClose = () => setSuccessDialogOpen(false);

    return (
        <div className="page" style={{ display: "flex" }}>
            <Sidebar />
            <div className="page-content">
                <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
                    <Box
                        sx={{
                            width: "75%",
                            padding: 3,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <h1>Order</h1>
                        <ProductsContainer
                            dataList={dataList}
                            handleAdd={handleAdd}
                            handleRemove={handleRemove}
                            host={VITE_REACT_APP_API_HOST}
                        />
                    </Box>
                    <Box
                        sx={{
                            width: "25%",
                            backgroundColor: "#f5f5f5",
                            padding: 3,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <OrderSummary
                            items={dataList.filter((item) => item.quantity > 0)}
                            total={calculateTotal()}
                            onPlaceOrder={handlePlaceOrder}
                        />
                    </Box>
                </Box>
                <OrderConfirmation
                    open={openConfirmation}
                    onClose={handleClose}
                    onConfirm={handleOrderConfirm}
                    items={dataList.filter((item) => item.quantity > 0)}
                    total={calculateTotal()}
                />
                <PaymentDialog
                    open={openPaymentDialog}
                    onClose={handlePaymentDialogClose}
                    onConfirm={handlePaymentConfirm}
                    amount={calculateTotal()}
                    recipient="Store Account"
                />
                <SuccessDialog
                    open={successDialogOpen}
                    onClose={handleSuccessDialogClose}
                    referenceId={referenceId}
                />
            </div>
        </div>
    );
}

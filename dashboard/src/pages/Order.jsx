import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box } from "@mui/material";
import Sidebar from "../components/common/Sidebar";
import ProductsContainer from "../components/common/ProductsContainer";
import OrderSummary from "../components/common/OrderSummary";
import OrderConfirmation from "../components/common/OrderConfirmation";
import SuccessDialog from "../components/common/SuccessDialog";
import PaymentDialog from "../components/common/PaymentDialog";
import { useRoleCheck } from "../hooks/useRoleCheck";

const { VITE_REACT_APP_API_HOST, VITE_REACT_APP_UNIONBANK_TOKEN } = import.meta.env;

export default function Order() {
    const navigate = useNavigate();
    useRoleCheck();

    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [referenceId, setReferenceId] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [bankInfo, setBankInfo] = useState(null);

    const [menuItems, setMenuItems] = useState([]);
    const [recipes, setRecipes] = useState({});
    const [stocks, setStocks] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuItemsResponse, recipesResponse, stocksResponse] = await Promise.all([
                    axios.get(`${VITE_REACT_APP_API_HOST}/api/menuItems`),
                    axios.get(`${VITE_REACT_APP_API_HOST}/api/recipes`),
                    axios.get(`${VITE_REACT_APP_API_HOST}/api/stocks`)
                ]);

                const activeMenuItems = menuItemsResponse.data
                    .filter(item => item.isActive)
                    .map(item => ({ ...item, quantity: 0 }));
                setMenuItems(activeMenuItems);

                const recipesMap = recipesResponse.data.reduce((acc, recipe) => {
                    if (!acc[recipe.menuItem]) acc[recipe.menuItem] = [];
                    acc[recipe.menuItem].push({ stockId: recipe.stock, quantity: recipe.quantity });
                    return acc;
                }, {});
                setRecipes(recipesMap);

                const stocksMap = stocksResponse.data.reduce((acc, stock) => {
                    acc[stock._id] = stock.quantity;
                    return acc;
                }, {});
                setStocks(stocksMap);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleQuantityChange = useCallback((productId, change) => {
        setMenuItems(prevItems => 
            prevItems.map(item => 
                item._id === productId 
                    ? { ...item, quantity: Math.max(0, item.quantity + change) }
                    : item
            )
        );
    }, []);

    const calculateTotal = useMemo(() => 
        menuItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [menuItems]);

    const orderItems = useMemo(() => 
        menuItems.filter(item => item.quantity > 0),
    [menuItems]);

    const handlePlaceOrder = () => {
        const canFulfillOrder = orderItems.every(item => {
            const recipe = recipes[item._id];
            return recipe?.every(ingredient => {
                const requiredQuantity = ingredient.quantity * item.quantity;
                return stocks[ingredient.stockId] >= requiredQuantity;
            });
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
        try {
            const res = await axios.post(
                `http://192.168.10.14:3001/api/unionbank/transfertransaction`,
                {
                    debitAccount: bankCredentials,
                    creditAccount: "000000019",
                    amount: calculateTotal,
                },
                {
                    headers: { Authorization: `Bearer ${VITE_REACT_APP_UNIONBANK_TOKEN}` },
                }
            );
    
            if (!res.data.success) {
                alert(res.data.message);
                return;
            }
    
            const newBankInfo = {
                name: "UnionBank",
                referenceId: res.data.reference,
            };
    
            setBankInfo(newBankInfo);
    
            const stockUpdates = orderItems.reduce((updates, item) => {
                const recipe = recipes[item._id];
                recipe?.forEach(ingredient => {
                    const requiredQuantity = ingredient.quantity * item.quantity;
                    updates[ingredient.stockId] = (updates[ingredient.stockId] || 0) + requiredQuantity;
                });
                return updates;
            }, {});
    
            await axios.post(`${VITE_REACT_APP_API_HOST}/api/stocks/update-multiple`, stockUpdates);
    
            const receiptRes = await axios.post(`${VITE_REACT_APP_API_HOST}/api/receipts`, {
                bank: newBankInfo,
                total: calculateTotal,
                items: orderItems,
                buyer: localStorage.getItem("_id"),
            });
    
            setTransactionId(receiptRes.data._id);
            setSuccessDialogOpen(true);
            setOpenPaymentDialog(false);
    
            setMenuItems(prevItems => prevItems.map(item => ({ ...item, quantity: 0 })));
            setStocks(prevStocks => {
                const newStocks = { ...prevStocks };
                Object.entries(stockUpdates).forEach(([stockId, quantity]) => {
                    newStocks[stockId] -= quantity;
                });
                return newStocks;
            });
    
            await axios.post(`${VITE_REACT_APP_API_HOST}/api/audits`, {
                action: "SUCCESSFUL CAFE ORDER",
                user: localStorage.getItem("_id"),
                details: `Successfully ordered with transaction ID: ${receiptRes.data._id}`,
            });
        } catch (error) {
            console.error("Error processing order:", error);
            alert("An error occurred while processing your order.");
        }
    };
    

    return (
        <div className="page" style={{ display: "flex" }}>
            <Sidebar />
            <div className="page-content">
                <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
                    <Box sx={{ width: "75%", padding: 3, display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 100px)" }}>
                        <h1>Order</h1>
                        <Box sx={{ overflowY: "auto" }}>
                            <ProductsContainer
                                dataList={menuItems}
                                handleAdd={(product) => handleQuantityChange(product._id, 1)}
                                handleRemove={(product) => handleQuantityChange(product._id, -1)}
                                host={VITE_REACT_APP_API_HOST}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ width: "25%", backgroundColor: "#f5f5f5", padding: 3, display: "flex", flexDirection: "column" }}>
                        <OrderSummary
                            items={orderItems}
                            total={calculateTotal}
                            onPlaceOrder={handlePlaceOrder}
                        />
                    </Box>
                </Box>
                <OrderConfirmation
                    open={openConfirmation}
                    onClose={() => setOpenConfirmation(false)}
                    onConfirm={handleOrderConfirm}
                    items={orderItems}
                    total={calculateTotal}
                />
                <PaymentDialog
                    open={openPaymentDialog}
                    onClose={() => setOpenPaymentDialog(false)}
                    onConfirm={handlePaymentConfirm}
                    amount={calculateTotal}
                    recipient="Store Account"
                />
                <SuccessDialog
                    open={successDialogOpen}
                    onClose={() => setSuccessDialogOpen(false)}
                    transactionId={transactionId}
                    bankInfo={bankInfo}
                />
            </div>
        </div>
    );
}
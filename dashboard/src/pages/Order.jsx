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
import StockErrorDialog from "../components/StockErrorDialog";
import { useRoleCheck } from "../hooks/useRoleCheck";

const { VITE_REACT_APP_API_HOST, VITE_REACT_APP_UNIONBANK_TOKEN } = import.meta.env;

export default function Order() {
    const navigate = useNavigate();
    useRoleCheck();

    const [dialogStates, setDialogStates] = useState({
        confirmation: false,
        payment: false,
        success: false,
        stockError: false,
    });
    const [orderData, setOrderData] = useState({
        referenceId: "",
        transactionId: "",
        bankInfo: null,
        stockErrorMessage: "",
    });
    const [menuItems, setMenuItems] = useState([]);
    const [recipes, setRecipes] = useState({});
    const [stocks, setStocks] = useState({});

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [menuItemsResponse, recipesResponse, stocksResponse] = await Promise.all([
                axios.get(`${VITE_REACT_APP_API_HOST}/api/menuItems`),
                axios.get(`${VITE_REACT_APP_API_HOST}/api/recipes`),
                axios.get(`${VITE_REACT_APP_API_HOST}/api/stocks`),
            ]);

            setMenuItems(menuItemsResponse.data.filter(item => item.isActive).map(item => ({ ...item, quantity: 0 })));
            setRecipes(createRecipesMap(recipesResponse.data));
            setStocks(createStocksMap(stocksResponse.data));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const createRecipesMap = (recipesData) => 
        recipesData.reduce((acc, recipe) => {
            if (!acc[recipe.menuItem]) acc[recipe.menuItem] = [];
            acc[recipe.menuItem].push({ stockId: recipe.stock, quantity: recipe.quantity });
            return acc;
        }, {});

    const createStocksMap = (stocksData) => 
        stocksData.reduce((acc, stock) => {
            acc[stock._id] = { name: stock.name, quantity: stock.quantity };
            return acc;
        }, {});

    const handleQuantityChange = useCallback((productId, change) => {
        setMenuItems(prevItems => 
            prevItems.map(item => 
                item._id === productId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
            )
        );
    }, []);

    const calculateTotal = useMemo(() => 
        menuItems.reduce((total, item) => total + item.price * item.quantity, 0),
        [menuItems]
    );

    const orderItems = useMemo(() => 
        menuItems.filter(item => item.quantity > 0),
        [menuItems]
    );

    const handlePlaceOrder = () => {
        const insufficientStockItems = checkStockAvailability();
        
        if (Object.keys(insufficientStockItems).length > 0) {
            const insufficientStockMessage = Object.entries(insufficientStockItems)
                .map(([menuItem, stocks]) => {
                    const stockList = stocks.map(({ stock, needed }) => 
                        `Insufficient stock: ${stock}, ${needed} more needed`
                    ).join('\n');
                    return `Menu Item: ${menuItem}\n${stockList}`;
                })
                .join('\n\n');
            
            setOrderData(prev => ({ ...prev, stockErrorMessage: insufficientStockMessage }));
            setDialogStates(prev => ({ ...prev, stockError: true }));
            return;
        }
    
        setDialogStates(prev => ({ ...prev, confirmation: true }));
    };

    const checkStockAvailability = () => {
        let insufficientStockItems = {};
    
        orderItems.forEach(item => {
            const recipe = recipes[item._id];
            recipe?.forEach(ingredient => {
                const requiredQuantity = ingredient.quantity * item.quantity;
                const stock = stocks[ingredient.stockId];
                if (!stock || stock.quantity < requiredQuantity) {
                    if (!insufficientStockItems[item.name]) {
                        insufficientStockItems[item.name] = [];
                    }
                    insufficientStockItems[item.name].push({
                        stock: stock?.name || "Unknown Stock",
                        needed: requiredQuantity - (stock?.quantity || 0)
                    });
                }
            });
        });

        return insufficientStockItems;
    };

    const handleOrderConfirm = () => {
        setDialogStates(prev => ({ ...prev, confirmation: false, payment: true }));
    };

    const handlePaymentConfirm = async (bankCredentials) => {
        try {
            const paymentResponse = await processPayment(bankCredentials);
            if (!paymentResponse.success) {
                alert(paymentResponse.message);
                return;
            }

            const newBankInfo = {
                name: "UnionBank",
                referenceId: paymentResponse.reference,
            };

            const stockUpdateResult = await updateStocksWithLocking();
            if (!stockUpdateResult.success) {
                alert(stockUpdateResult.message);
                // Reverse the payment here if possible
                return;
            }

            const receiptResponse = await createReceipt(newBankInfo);

            setOrderData(prev => ({
                ...prev,
                bankInfo: newBankInfo,
                transactionId: receiptResponse.data._id,
            }));

            setDialogStates(prev => ({ ...prev, payment: false, success: true }));
            resetOrder();
            await createAuditLog(receiptResponse.data._id);
        } catch (error) {
            console.error("Error processing order:", error);
            alert("An error occurred while processing your order.");
        }
    };

    const updateStocksWithLocking = async () => {
        const stockUpdates = calculateStockUpdates();
        try {
            const response = await axios.post(`${VITE_REACT_APP_API_HOST}/api/stocks/update-with-locking`, {
                updates: stockUpdates,
                currentStocks: stocks  // Send current stock versions
            });
            
            if (response.data.success) {
                updateLocalStocks(stockUpdates);
                return { success: true };
            } else {
                return { 
                    success: false, 
                    message: "Stock levels have changed. Please review your order and try again." 
                };
            }
        } catch (error) {
            console.error("Error updating stocks:", error);
            return { 
                success: false, 
                message: error.response.data.message 
            };
        }
    };

    const processPayment = async (bankCredentials) => {
        const res = await axios.post(
            `http://192.168.10.14:3001/api/unionbank/transfertransaction`,
            {
                debitAccount: bankCredentials,
                creditAccount: "000000019",
                amount: calculateTotal,
            },
            {
                headers: {
                    Authorization: `Bearer ${VITE_REACT_APP_UNIONBANK_TOKEN}`,
                },
            }
        );
        return res.data;
    };

    const updateStocks = async () => {
        const stockUpdates = calculateStockUpdates();
        await axios.post(`${VITE_REACT_APP_API_HOST}/api/stocks/update-multiple`, stockUpdates);
        updateLocalStocks(stockUpdates);
    };

    const calculateStockUpdates = () => 
        orderItems.reduce((updates, item) => {
            const recipe = recipes[item._id];
            recipe?.forEach(ingredient => {
                const requiredQuantity = ingredient.quantity * item.quantity;
                updates[ingredient.stockId] = (updates[ingredient.stockId] || 0) + requiredQuantity;
            });
            return updates;
        }, {});

    const updateLocalStocks = (stockUpdates) => {
        setStocks(prevStocks => {
            const newStocks = { ...prevStocks };
            Object.entries(stockUpdates).forEach(([stockId, quantity]) => {
                newStocks[stockId].quantity -= quantity;
            });
            return newStocks;
        });
    };

    const createReceipt = async (bankInfo) => 
        await axios.post(`${VITE_REACT_APP_API_HOST}/api/receipts`, {
            bank: bankInfo,
            total: calculateTotal,
            items: orderItems,
            buyer: localStorage.getItem("_id"),
        });

    const resetOrder = () => {
        setMenuItems(prevItems => prevItems.map(item => ({ ...item, quantity: 0 })));
    };

    const createAuditLog = async (transactionId) => 
        await axios.post(`${VITE_REACT_APP_API_HOST}/api/audits`, {
            action: "SUCCESSFUL CAFE ORDER",
            user: localStorage.getItem("_id"),
            details: `Successfully ordered with transaction ID: ${transactionId}`,
        });

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
                    open={dialogStates.confirmation}
                    onClose={() => setDialogStates(prev => ({ ...prev, confirmation: false }))}
                    onConfirm={handleOrderConfirm}
                    items={orderItems}
                    total={calculateTotal}
                />
                <PaymentDialog
                    open={dialogStates.payment}
                    onClose={() => setDialogStates(prev => ({ ...prev, payment: false }))}
                    onConfirm={handlePaymentConfirm}
                    amount={calculateTotal}
                    recipient="Store Account"
                />
                <SuccessDialog
                    open={dialogStates.success}
                    onClose={() => setDialogStates(prev => ({ ...prev, success: false }))}
                    transactionId={orderData.transactionId}
                    bankInfo={orderData.bankInfo}
                />
                <StockErrorDialog
                    open={dialogStates.stockError}
                    onClose={() => setDialogStates(prev => ({ ...prev, stockError: false }))}
                    errorMessage={orderData.stockErrorMessage}
                />
            </div>
        </div>
    );
}
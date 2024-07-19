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

export default function Savemore() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST, VITE_REACT_APP_UNIONBANK_TOKEN } =
        import.meta.env;
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [referenceId, setReferenceId] = useState("");
    const savemoreHost = "http://192.168.10.25:3004";

    useRoleCheck();

    useEffect(() => {
        axios
            .get(`${savemoreHost}/getallproducts`)
            .then((response) => {
                const initializedData = response.data.data.map((item) => ({
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
        return dataList.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const handlePlaceOrder = () => {
        setOpenConfirmation(true);
    };

    const handleConfirmOrder = () => {
        setOpenConfirmation(false);
        setOpenPaymentDialog(true);
    };

    const handlePaymentConfirm = async (bankCredentials) => {
        try {
            const totalAmount = calculateTotal();

            // Union Bank transaction
            const res = await axios.post(
                `http://192.168.10.14:3001/api/unionbank/transfertransaction`,
                {
                    debitAccount: bankCredentials,
                    creditAccount: "000000007",
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

            setReferenceId(res.data.reference);
            setSuccessDialogOpen(true);
            setOpenPaymentDialog(false);

            // Prepare ordered items for stock update and sales details
            const orderedItems = dataList.filter((item) => item.quantity > 0);

            // Stock update
            const stockUpdateData = orderedItems.map(({ name, quantity }) => ({
                name,
                quantity,
            }));
            const stockResponse = await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/stocks/bulk`,
                stockUpdateData
            );

            if (!stockResponse.data.success) {
                alert(stockResponse.data.message);
            }

            // Sales details report
            const currentDate = new Date().toISOString();
            for (const item of orderedItems) {
                const salesDetailData = {
                    product: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    date: currentDate,
                };

                try {
                    const salesResponse = await axios.post(
                        `${savemoreHost}/api/salesdetails`,
                        salesDetailData
                    );
                } catch (error) {
                    console.error(
                        `Error updating sales details for ${item.name}:`,
                        error
                    );
                }
            }

            // Reset the cart
            setDataList((prevList) =>
                prevList.map((item) => ({ ...item, quantity: 0 }))
            );
            setOpenConfirmation(false);

            axios.post(`${VITE_REACT_APP_API_HOST}/api/audits`, {
                action: "SUCCESSFUL CAFE ORDER",
                user: localStorage.getItem("_id"),
                details: `Successfully ordered with reference ID: ${referenceId}`,
            });
        } catch (error) {
            console.error("Error in handleConfirmOrder:", error);
            alert(
                "An error occurred while processing your order. Please try again."
            );
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
                            maxHeight: "calc(100vh - 100px)",
                        }}
                    >
                        <h1>Online Savemore</h1>
                        <Box
                            sx={{
                                overflowY: "auto",
                            }}
                        >
                            <ProductsContainer
                                dataList={dataList}
                                handleAdd={handleAdd}
                                handleRemove={handleRemove}
                                host={savemoreHost}
                            />
                        </Box>
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
                    onConfirm={handleConfirmOrder}
                    items={dataList.filter((item) => item.quantity > 0)}
                    total={calculateTotal()}
                />
                <PaymentDialog
                    open={openPaymentDialog}
                    onClose={handlePaymentDialogClose}
                    onConfirm={handlePaymentConfirm}
                    amount={calculateTotal()}
                    recipient="Savemore Account"
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

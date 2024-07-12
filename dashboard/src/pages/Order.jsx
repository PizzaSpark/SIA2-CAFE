import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import ProductsContainer from "../components/common/ProductsContainer";
import OrderSummary from "../components/OrderSummary";
import { Box } from "@mui/material";
import OrderConfirmation from "../components/OrderConfirmation";
import SuccessDialog from "../components/SuccessDialog";

export default function Order() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST, VITE_REACT_APP_UNIONBANK_TOKEN } =
        import.meta.env;
    const resourceName = "menuItems";
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [referenceId, setReferenceId] = useState('');

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
        return dataList.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const handlePlaceOrder = () => {
        setOpen(true);
    };

    const handleConfirmOrder = async () => {
        const bankNo = JSON.parse(localStorage.getItem("bankNo")); //json parse para mawala yung quotation ng string
        const totalAmount = calculateTotal();

        const res = await axios.post(
            `http://192.168.10.14:3001/api/unionbank/transfertransaction`,
            {
                debitAccount: bankNo,
                creditAccount: "000000019",
                amount: totalAmount,
            },
            {
                headers: {
                    Authorization: `Bearer ${VITE_REACT_APP_UNIONBANK_TOKEN}`,
                },
            }
        );

        console.log(res);

        if (!res.data.success) {
            alert(res.data.message);
            onConfirm(); // Call the original onConfirm prop function
        }

        setReferenceId(res.data.reference);
        setSuccessDialogOpen(true);
        // Reset the cart
        setDataList((prevList) =>
            prevList.map((item) => ({ ...item, quantity: 0 }))
        );
        setOpen(false);
    };

    const handleClose = () => setOpen(false);

    const handleSuccessDialogClose = () => {
        setSuccessDialogOpen(false);
    };

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
                    open={open}
                    onClose={handleClose}
                    onConfirm={handleConfirmOrder}
                    items={dataList.filter((item) => item.quantity > 0)}
                    total={calculateTotal()}
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

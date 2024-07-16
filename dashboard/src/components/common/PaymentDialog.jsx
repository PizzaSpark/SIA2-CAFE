import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
} from "@mui/material";

const PaymentDialog = ({ open, onClose, onConfirm, amount, recipient }) => {
    const [bankCredentials, setBankCredentials] = useState("");

    useEffect(() => {
        if (open) {
            setBankCredentials("");
        }
    }, [open]);

    const handleConfirm = () => {
        if (bankCredentials.length === 9) {
            onConfirm(bankCredentials);
        } else {
            alert("Please enter valid bank credentials (9 digits)");
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(price);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Payment Confirmation</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Bank Credentials"
                    type="number"
                    fullWidth
                    value={bankCredentials}
                    onChange={(e) => setBankCredentials(e.target.value)}
                    inputProps={{ maxLength: 9 }}
                />
                <Typography variant="body1" style={{ marginTop: "1rem" }}>
                    Recipient: {recipient}
                </Typography>
                <Typography variant="body1">
                    Amount: {formatPrice(amount)}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    Confirm Payment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentDialog;

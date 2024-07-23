import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

const SuccessDialog = ({ open, onClose, transactionId, bankInfo }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minWidth: "300px",
                },
            }}
        >
            <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
                <CheckCircleOutline
                    color="success"
                    sx={{ fontSize: 40, mb: 1 }}
                />
                <Typography variant="h5" component="div">
                    Order Successful!
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 2 }}>
                <Typography variant="body1" gutterBottom>
                    Your order has been successfully placed and processed.
                </Typography>
                {bankInfo && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Bank Name: <strong>{bankInfo.name}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Bank Reference ID:{" "}
                            <strong>{bankInfo.referenceId}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Transaction ID: <strong>{transactionId}</strong>
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                    onClick={onClose}
                    color="primary"
                    variant="contained"
                    sx={{ minWidth: "100px" }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SuccessDialog;

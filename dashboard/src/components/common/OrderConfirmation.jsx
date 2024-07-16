import React from "react";
import {
    Modal,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Box,
} from "@mui/material";

export default function OrderConfirmation({
    open,
    onClose,
    onConfirm,
    items,
    total,
}) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(price);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: 4,
                    width: 400,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Confirm Order
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to place this order?
                </Typography>
                <List sx={{ flexGrow: 1, overflowY: "auto", maxHeight: 200 }}>
                    {items.map((item) => (
                        <ListItem key={item._id} disablePadding>
                            <ListItemText
                                primary={item.name}
                                secondary={`Quantity: ${item.quantity}`}
                            />
                            <Typography variant="body2">
                                {formatPrice(item.price * item.quantity)}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" align="right" sx={{ my: 2 }}>
                    Total: {formatPrice(total)}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}

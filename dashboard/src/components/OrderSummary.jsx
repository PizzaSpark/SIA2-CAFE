import React from "react";
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Box,
} from "@mui/material";

export default function OrderSummary({ items, total, onPlaceOrder }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(price);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>
            <List sx={{ flexGrow: 1, overflowY: "auto" }}>
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
            <Box sx={{ mt: "auto", pt: 2 }}>
                <Divider />
                <Typography variant="h6" align="right" sx={{ my: 2 }}>
                    Total: {formatPrice(total)}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={items.length === 0}
                    onClick={onPlaceOrder}
                >
                    Place Order
                </Button>
            </Box>
        </Paper>
    );
}

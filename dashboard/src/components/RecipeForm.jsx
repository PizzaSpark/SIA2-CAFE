import {
    Box,
    Button,
    MenuItem,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { React, useState, useEffect, useMemo } from "react";

export default function RecipeForm({
    open,
    onClose,
    dataToEdit,
    onSubmit,
    menuItems,
    stocks,
    dataList,
}) {
    const initialFormData = {
        menuItem: "",
        stock: "",
        quantity: 0,
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (dataToEdit) {
            setFormData(dataToEdit);
        } else {
            setFormData(initialFormData);
        }
    }, [dataToEdit]);

    // Create a map of menu items to their used stocks
    const usedStocksMap = useMemo(() => {
        return dataList.reduce((acc, recipe) => {
            if (!acc[recipe.menuItem]) {
                acc[recipe.menuItem] = new Set();
            }
            acc[recipe.menuItem].add(recipe.stock);
            return acc;
        }, {});
    }, [dataList]);

    // Filter available stocks based on the selected menu item
    const availableStocks = useMemo(() => {
        if (!formData.menuItem) return stocks;
        const usedStocks = usedStocksMap[formData.menuItem] || new Set();
        return stocks.filter(stock => !usedStocks.has(stock._id));
    }, [formData.menuItem, stocks, usedStocksMap]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Reset stock when menu item changes
        if (name === 'menuItem') {
            setFormData((prev) => ({
                ...prev,
                stock: '',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialFormData);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 5,
                }}
            >
                <Typography variant="h6" component="h2">
                    Recipe Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        select
                        label="Menu Item"
                        name="menuItem"
                        value={formData.menuItem}
                        onChange={handleChange}
                    >
                        {menuItems.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="normal"
                        fullWidth
                        select
                        label="Stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        disabled={!formData.menuItem}
                    >
                        {availableStocks.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="normal"
                        fullWidth
                        type="number"
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    />

                    <Button type="submit" variant="contained" color="primary">
                        {dataToEdit ? "Update" : "Submit"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}
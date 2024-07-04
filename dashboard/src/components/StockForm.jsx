import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { React, useState, useEffect } from "react";

export default function StockForm({ open, onClose, onSubmit, dataToEdit }) {
    const initialFormData = {
        name: "",
        quantity: 0,
        minimum: 0,
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (dataToEdit) {
            setFormData(dataToEdit);
        } else {
            setFormData(initialFormData);
        }
    }, [dataToEdit]);

    useEffect(() => {
        if (!open) {
            setFormData(initialFormData);
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                    Stock Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        type="number"
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        type="number"
                        label="Minimum"
                        name="minimum"
                        value={formData.minimum}
                        onChange={handleChange}
                    />

                    <Button type="submit" variant="contained" color="primary">
                        {dataToEdit ? "Update" : "Submit"}
                    </Button>

                    {dataToEdit && (
                        <Button variant="outlined" color="primary">
                            Delete
                        </Button>
                    )}
                </form>
            </Box>
        </Modal>
    );
}

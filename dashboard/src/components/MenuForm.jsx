import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Input,
    MenuItem,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { React, useState, useEffect } from "react";

export default function MenuForm({ open, onClose, dataToEdit, onSubmit }) {
    const initialFormData = {
        name: "",
        price: "",
        image: null,
        disabled: false,
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (dataToEdit) {
            setFormData({ ...dataToEdit, image: null });
        } else {
            setFormData(initialFormData);
        }
    }, [dataToEdit, open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        for (const key in formData) {
            formDataObj.append(key, formData[key]);
        }
        onSubmit(formDataObj);
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
                    Menu Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        inputProps={{ accept: "image/*" }}
                        fullWidth
                    />
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
                        label="Price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.disabled}
                                onChange={handleChange}
                                name="disabled"
                            />
                        }
                        label="Disabled"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        {dataToEdit ? "Update" : "Submit"}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}

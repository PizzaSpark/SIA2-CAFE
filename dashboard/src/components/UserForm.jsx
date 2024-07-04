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

export default function UserForm({ open, onClose, onSubmit, userToEdit }) {
    const initialFormData = {
        email: "",
        password: "",
        name: "",
        role: "",
        disabled: false,
    };
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData(initialFormData);
        }
    }, [userToEdit]);

    useEffect(() => {
        if (!open) {
            setFormData(initialFormData);
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
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
                    User Form
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
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
                        select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <MenuItem value="Customer">Customer</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Owner">Owner</MenuItem>
                        <MenuItem value="Staff">Staff</MenuItem>
                    </TextField>
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
                        {userToEdit ? "Update" : "Submit"}
                    </Button>

                    {userToEdit && (
                        <Button variant="outlined" color="primary">
                            Delete
                        </Button>
                    )}
                </form>
            </Box>
        </Modal>
    );
}

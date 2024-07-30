import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    IconButton,
    InputAdornment,
    TextField,
    Button,
    Box,
    Paper,
    Typography,
    Link,
} from "@mui/material";
import {
    Coffee,
    Visibility as Eye,
    VisibilityOff as EyeOff,
} from "@mui/icons-material";
import coffeebg from "../assets/coffee-bg.png";

export default function Signup() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const initialFormData = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    };
    const [formData, setFormData] = useState(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleTogglePassword = (field) => {
        if (field === 'password') {
            setShowPassword((prev) => !prev);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword((prev) => !prev);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/users/signup`,
                formData
            );

            for (const key in response.data) {
                if (response.data.hasOwnProperty(key)) {
                    localStorage.setItem(key, response.data[key]);
                }
            }

            await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/audits`,
                {
                    action: "USER SIGNUP",
                    user: localStorage.getItem("_id"),
                    details: "New user signed up"
                }
            );

            navigate("/order");
        } catch (error) {
            console.error(
                "Signup failed",
                error.response ? error.response.data : error
            );

            alert(error.response.data.message);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F5E6D3",
                backgroundImage: `url(${coffeebg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 2,
                    maxWidth: 400,
                    width: "100%",
                }}
            >
                <Coffee size={48} color="#6F4E37" />
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        color: "#6F4E37",
                        fontFamily: "'Playfair Display', serif",
                    }}
                >
                    Join Reyes Cafe
                </Typography>
                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ color: "#8B4513", marginBottom: 3 }}
                >
                    Create your account
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={formData.name}
                        onChange={handleChange}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#8B4513",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#6F4E37",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#8B4513",
                            },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#8B4513",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#6F4E37",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#8B4513",
                            },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#8B4513",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#6F4E37",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#8B4513",
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => handleTogglePassword('password')}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <EyeOff color="#6F4E37" />
                                        ) : (
                                            <Eye color="#6F4E37" />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#8B4513",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#6F4E37",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#8B4513",
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => handleTogglePassword('confirmPassword')}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff color="#6F4E37" />
                                        ) : (
                                            <Eye color="#6F4E37" />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: "#6F4E37",
                            "&:hover": {
                                backgroundColor: "#8B4513",
                            },
                        }}
                    >
                        Sign Up
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link href="/" variant="body2" sx={{ color: "#6F4E37" }}>
                            Already have an account? Sign in
                        </Link>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
    IconButton,
    InputAdornment,
    TextField,
    Button,
    Box,
    Paper,
    Typography,
} from "@mui/material";
import {
    Coffee,
    Visibility as Eye,
    VisibilityOff as EyeOff,
} from "@mui/icons-material";
import coffeebg from "../assets/coffee-bg.png";

export default function Login() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    //MARK: INIT
    const initialFormData = {
        email: "",
        password: "",
    };
    const [formData, setFormData] = useState(initialFormData);
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    useEffect(() => {
        const _id = localStorage.getItem('_id');
        if (_id) {
          navigate('/dashboard');
        }
      }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/users/login`,
                formData
            );

            localStorage.setItem("_id", response.data._id);

            await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/audits`,
                {
                    action: "USER LOGIN",
                    user: localStorage.getItem("_id"),
                    details: "User signed in"
                }
            );

            navigate("/dashboard");
        } catch (error) {
            console.error(
                "Login failed",
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
                    Welcome to Reyes Cafe
                </Typography>
                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ color: "#8B4513", marginBottom: 3 }}
                >
                    Please sign in to continue
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
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
                                        onClick={handleTogglePassword}
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
                        Sign In
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link to="/signup" style={{ color: "#6F4E37", textDecoration: 'none' }}>
                            Don't have an account? Sign up
                        </Link>
                    </Box>


                </form>
            </Paper>
        </Box>
    );
}

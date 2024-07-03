import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";

import {
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    TextField,
    Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await axios.post(
                `${VITE_REACT_APP_API_HOST}/api/users/login`,
                formData
            );

            // Assuming the response includes a token you need to store
            localStorage.setItem("userToken", response.data.token);

            // Redirect the user
            navigate("/dashboard"); // Adjust the path as needed
        } catch (error) {
            // Handle error (e.g., showing an error message)
            console.error(
                "Login failed",
                error.response ? error.response.data : error
            );
            // Optionally, update the state to show an error message
        }
    };

    return (
        <div className="auth-page">
            <Card className="auth-card">
                <CardContent className="auth-card-content">
                    <h1>Login</h1>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                        />

                        <TextField
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button variant="contained" type="submit">
                            SIGN IN
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

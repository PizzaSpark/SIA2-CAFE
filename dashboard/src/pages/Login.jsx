import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import "../styles/Login.css";

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
        e.preventDefault();

        const { email, password } = formData;

        if (email != "admin@gmail.com" && password != "admin") {
            alert("Invalid password");
            return;
        }

        navigate("/dashboard");
    };

    const resetForm = () => {
        setFormData(initialFormState);
      };

    return (
        <div className="auth-page">
            <Card className="auth-card">
                <CardContent className="auth-card-content">
                    <h1>Login</h1>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            id="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                        />

                        <TextField
                            id="password"
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

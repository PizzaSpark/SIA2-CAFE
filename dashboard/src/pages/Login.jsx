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
    //MARK: INIT
    const initialData = {
        user_email: "",
        user_password: "",
    };
    const [currentData, setCurrentData] = useState(initialData);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setCurrentData({
            ...currentData,
            [e.target.name || e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { user_email, user_password } = currentData;

        if(user_email != "admin@gmail.com" && user_password != "admin") {
            alert("Invalid password");
            return;
        }

        navigate("/dashboard");
    };

    return (
        <div className="auth-page">
            <Card className="auth-card">
                <CardContent className="auth-card-content">
                    <h1>Login</h1>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            id="user_email"
                            label="Email"
                            value={currentData.user_email}
                            onChange={handleChange}
                            variant="outlined"
                        />

                        <TextField
                            id="user_password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={currentData.user_password}
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

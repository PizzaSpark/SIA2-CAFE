import React from "react";
import NotFoundImage from "../assets/404_NotFound.png";

export default function NotFound() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                backgroundColor: "#f3f4f6",
            }}
        >
            <div
                style={{
                    textAlign: "center",
                    width: "100%",
                    maxWidth: "400px",
                    padding: "0 16px",
                }}
            >
                <div style={{ width: "50%", margin: "0 auto 16px" }}>
                    <img
                        src={NotFoundImage}
                        alt="Forbidden Access"
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                </div>
                <h1
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#dc2626",
                        marginBottom: "8px",
                    }}
                >
                    Not Found
                </h1>
                <p style={{ color: "#4b5563" }}>
                    This page you tried to visit does not exist.
                </p>
            </div>
        </div>
    );
}

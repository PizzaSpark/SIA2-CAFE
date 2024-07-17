import React from "react";
import ForbiddenImage from "../assets/403_Forbidden.png";

export default function Forbidden() {
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
                        src={ForbiddenImage}
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
                    Access Forbidden
                </h1>
                <p style={{ color: "#4b5563" }}>
                    You don't have permission to access this page.
                </p>
            </div>
        </div>
    );
}

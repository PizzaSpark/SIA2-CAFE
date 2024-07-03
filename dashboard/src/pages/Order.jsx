import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function Order() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <Sidebar/>
            <div className="page-content">
                <div className="space-between">
                    <h1>Order</h1>
                </div>
            </div>
        </div>
    );
}

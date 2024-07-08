import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";

export default function Recipe() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <Sidebar/>
            <div className="page-content">
                <h1>Recipe</h1>
            </div>
        </div>
    );
}

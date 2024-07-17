import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { useRoleCheck } from '../hooks/useRoleCheck';

export default function Dashboard() {
    const navigate = useNavigate();
    useRoleCheck();
    return (
        <div className="page">
            <Sidebar/>
            <div className="page-content">
                <div className="space-between">
                    <h1>Dashboard</h1>
                </div>
            </div>
        </div>
    );
}

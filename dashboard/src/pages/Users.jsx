import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function Users() {
  const navigate = useNavigate();

    return (
        <div className="page">
            <Sidebar/>
            <div className="page-content">
                <div className="space-between">
                    <h1>Users</h1>
                </div>
            </div>
        </div>
    );
}

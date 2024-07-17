import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/common/Sidebar";
import { useRoleCheck } from "../hooks/useRoleCheck";
import AuditTable from "../components/AuditTable";

export default function AuditLog() {
    const navigate = useNavigate();
    const { VITE_REACT_APP_API_HOST } = import.meta.env;
    const resourceName = "audits";
    const [open, setOpen] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(null);

    useRoleCheck();

    useEffect(() => {
        axios
            .get(`${VITE_REACT_APP_API_HOST}/api/${resourceName}`)
            .then((response) => {
                setDataList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching dataList:", error);
                setDataList([]);
            });
    }, []);

    return (
        <div className="page">
            <Sidebar />
            <div className="page-content">
                <h1>Audit Log</h1>

                <AuditTable 
                    dataList={dataList}
                />
            </div>
        </div>
    );
}

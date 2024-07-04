import { React, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function UserTable({ dataList, onEdit }) {
    if (!Array.isArray(dataList)) {
        return <div>No dataList available.</div>;
    }

    const columns = [
        { field: "email", headerName: "Email", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "role", headerName: "Role", flex: 1 },
        {
            field: "disabled",
            headerName: "Disabled",
            flex: 1,
            renderCell: (params) => (params.value ? "Yes" : "No"),
        },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: "updatedAt",
            headerName: "Updated On",
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleDateString(),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onEdit(params.row)}
                >
                    <EditIcon />
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ flex: 1 }}>
            <DataGrid
                rows={dataList}
                columns={columns}
                getRowId={(row) => row._id}
                autoPageSize
                pagination
                disableRowSelectionOnClick
                checkboxSelection
            />
        </Box>
    );
}

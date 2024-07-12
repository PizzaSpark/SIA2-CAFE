import { React, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function UserTable({ dataList, onEdit, onDelete }) {
    const columns = [
        { field: "email", headerName: "Email", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "role", headerName: "Role", flex: 1 },
        { field: "bankName", headerName: "Bank Name", flex: 1 },
        { field: "bankNo", headerName: "Bank No.", flex: 1 },
        {
            field: "isActive",
            headerName: "Is Active",
            flex: 1,
            renderCell: (params) => (params.value ? "✔" : "✖"),
        },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleString(),
        },
        {
            field: "updatedAt",
            headerName: "Updated On",
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleString(),
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onEdit(params.row)}
                    >
                        <Edit />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onDelete(params.row._id)}
                    >
                        <Delete />
                    </Button>
                </>
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
            />
        </Box>
    );
}

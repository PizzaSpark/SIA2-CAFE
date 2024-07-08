import { React, useState } from "react";
import { Box, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

export default function RecipeTable({
    dataList,
    onEdit,
    onDelete,
    menuItems,
    stocks,
}) {
    const columns = [
        {
            field: "menuItem",
            headerName: "Menu Item",
            flex: 1,
            renderCell: (params) => {
                const menuItem = menuItems.find(item => item._id === params.value);
                return menuItem ? menuItem.name : "Unknown";
            },
        },
        {
            field: "stock",
            headerName: "Stock",
            flex: 1,
            renderCell: (params) => {
                const stock = stocks.find(item => item._id === params.value);
                return stock ? stock.name : "Unknown";
            },
        },
        { field: "quantity", headerName: "Quantity", flex: 1 },
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

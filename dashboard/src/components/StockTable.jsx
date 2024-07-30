import { React, useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function StockTable({ dataList, onEdit, onDelete }) {
    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "quantity", headerName: "Quantity", flex: 1 },
        { field: "minimum", headerName: "Minimum", flex: 1 },
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
            headerAlign: 'center',
            flex: 1,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Tooltip title="Edit Stock">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onEdit(params.row)}
                        >
                            <Edit />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Delete Stock">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => onDelete(params.row._id)}
                        >
                            <Delete />
                        </Button>
                    </Tooltip>
                </Box>
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
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                }}
            />
        </Box>
    );
}

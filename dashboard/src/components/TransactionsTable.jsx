import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function TransactionsTable({ dataList }) {
    const columns = [
        { field: "_id", headerName: "ID", flex: 1 },
        { field: "total", headerName: "Total", flex: 1 },
        {
            field: "items",
            headerName: "Items",
            flex: 2,
            renderCell: (params) => (
                <Box>
                    {params.value.map((item, index) => (
                        <Typography key={item._id} variant="body2" sx={{ mb: 0.5 }}>
                            {item.name} (x{item.quantity}) - ${item.price}
                        </Typography>
                    ))}
                </Box>
            ),
        },
        { field: "buyer", headerName: "Buyer", flex: 1 },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleString(),
        }
    ];

    return (
        <Box sx={{ flex: 1, height: 400 }}>
            <DataGrid
                rows={dataList}
                columns={columns}
                getRowId={(row) => row._id}
                autoPageSize
                pagination
                disableRowSelectionOnClick
                sortModel={[
                    {
                        field: 'createdAt',
                        sort: 'desc',
                    },
                ]}
            />
        </Box>
    );
}
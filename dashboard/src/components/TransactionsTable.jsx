import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function TransactionsTable({ dataList, users }) {
    const columns = [
        { field: "_id", headerName: "ID", flex: 1 },
        { field: "total", headerName: "Total", flex: 1 },
        {
            field: "items",
            headerName: "Items",
            flex: 2,
            renderCell: (params) => (
                <Box>
                    {params.value.map((item) => (
                        <Typography
                            key={item._id}
                            variant="body2"
                            sx={{ mb: 0.5 }}
                        >
                            {item.name} (x{item.quantity}) - ${item.price}
                        </Typography>
                    ))}
                </Box>
            ),
        },
        {
            field: "buyer",
            headerName: "Buyer",
            flex: 1,
            valueGetter: (params) => {
                const buyer = users.find((user) => user._id === params);
                return buyer ? buyer.name : "Unknown Buyer";
            },
        },
        {
            field: "bank",
            headerName: "Bank Information",
            flex: 2,
            valueGetter: (params) => {
                const bankInfo = params;
                if (bankInfo && bankInfo.length > 0) {
                    return `${bankInfo[0].name} - Ref: ${bankInfo[0].referenceId}`;
                }
                return "No bank information";
            },
        },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleString(),
        },
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
                        field: "createdAt",
                        sort: "desc",
                    },
                ]}
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

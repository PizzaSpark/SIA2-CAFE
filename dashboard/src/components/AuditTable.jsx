import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function AuditTable({ dataList }) {
    const columns = [
        { field: "action", headerName: "Action", flex: 1 },
        { field: "user", headerName: "User", flex: 1 },
        { field: "details", headerName: "Role", flex: 1 },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleString(),
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
                sortModel={[
                    {
                        field: 'createdAt',
                        sort: 'desc', // Sort by descending order to show the newest first
                    },
                ]}
            />
        </Box>
    );
}

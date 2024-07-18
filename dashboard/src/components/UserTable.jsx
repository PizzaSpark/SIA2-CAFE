import { React } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Tooltip } from "@mui/material";
import { Edit, Delete, LockReset } from "@mui/icons-material";

export default function UserTable({
    dataList,
    onEdit,
    onDelete,
    onPasswordReset,
}) {
    const columns = [
        { field: "email", headerName: "Email", flex: 1 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "role", headerName: "Role", flex: 1 },
        {
            field: "isActive",
            headerName: "Is Active",
            flex: 1,
            renderCell: (params) => (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: params.value
                                ? "#4caf50"
                                : "#f44336",
                            color: "white",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "bold",
                        }}
                    >
                        {params.value ? "✓" : "✘"}
                    </div>
                </div>
            ),
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
                    <Tooltip title="Edit User">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onEdit(params.row)}
                        >
                            <Edit />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete User">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => onDelete(params.row._id)}
                        >
                            <Delete />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Reset Password">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => onPasswordReset(params.row._id)}
                        >
                            <LockReset />
                        </Button>
                    </Tooltip>
                </Box>
            ),
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
            />
        </Box>
    );
}

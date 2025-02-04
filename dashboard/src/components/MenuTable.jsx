import { React, useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ImagePreviewModal from "./common/ImagePreviewModal";

export default function MenuTable({ dataList, onEdit, onDelete }) {
    const { VITE_REACT_APP_API_HOST } = import.meta.env;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState("");

    const handlePreviewOpen = (imageUrl) => {
        setPreviewImageUrl(imageUrl);
        setPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setPreviewOpen(false);
    };

    const columns = [
        {
            field: "image",
            headerName: "Image",
            flex: 1,
            renderCell: (params) => {
                const imageUrl = `${VITE_REACT_APP_API_HOST}/uploads/${params.value}`;
                return (
                    <img
                        src={imageUrl}
                        alt="Table Cell Image"
                        style={{
                            width: "100px",
                            height: "auto",
                            cursor: "pointer",
                        }}
                        onClick={() => handlePreviewOpen(imageUrl)}
                    />
                );
            },
        },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "price", headerName: "Price", flex: 1 },
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
                    <Tooltip title="Edit Menu">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onEdit(params.row)}
                        >
                            <Edit />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Delete Menu">
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
            <ImagePreviewModal
                open={previewOpen}
                onClose={handlePreviewClose}
                imageUrl={previewImageUrl}
            />
        </Box>
    );
}

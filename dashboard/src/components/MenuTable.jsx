import { React, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ImagePreviewModal from "./ImagePreviewModal";

export default function MenuTable({ dataList, onEdit, onDelete }) {
    
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
                const imageUrl = `http://localhost:1337/uploads/${params.value}`;
                return (
                    <img
                        src={imageUrl}
                        alt="Table Cell Image"
                        style={{ 
                            width: "100px", 
                            height: "auto", 
                            cursor: "pointer" 
                        }}
                        onClick={() => handlePreviewOpen(imageUrl)}
                    />
                );
            },
        },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "price", headerName: "Price", flex: 1 },
        {
            field: "disabled",
            headerName: "Disabled",
            flex: 1,
            renderCell: (params) => (params.value ? "✔" : "✖"),
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
            <ImagePreviewModal
                open={previewOpen}
                onClose={handlePreviewClose}
                imageUrl={previewImageUrl}
            />
        </Box>
    );
}

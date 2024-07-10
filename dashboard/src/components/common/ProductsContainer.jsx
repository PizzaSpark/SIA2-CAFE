import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia,
    Box,
    Grid,
    IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import ImagePreviewModal from "./ImagePreviewModal";

export default function ProductsContainer({
    dataList,
    handleAdd,
    handleRemove,
    host,
}) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState("");

    const handlePreviewOpen = (imageUrl) => {
        setPreviewImageUrl(imageUrl);
        setPreviewOpen(true);
    };

    const handlePreviewClose = () => {
        setPreviewOpen(false);
    };

    return (
        <Grid container spacing={2}>
            {dataList.map((product) => {
                const imageUrl = `${host}/uploads/${product.image}`;
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                        <Card sx={{ display: 'flex', height: '100%' }}>
                            <CardMedia
                                sx={{ width: 100, cursor: 'pointer' }}
                                image={imageUrl}
                                title={product.name}
                                onClick={() => handlePreviewOpen(imageUrl)}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <CardContent sx={{ flexGrow: 1, py: 1 }}>
                                    <Typography variant="subtitle1" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ₱{product.price}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                                    <IconButton size="small" onClick={() => handleRemove(product)}>
                                        <Remove fontSize="small" />
                                    </IconButton>
                                    <Typography variant="body2">
                                        {product.quantity || 0}
                                    </Typography>
                                    <IconButton size="small" onClick={() => handleAdd(product)}>
                                        <Add fontSize="small" />
                                    </IconButton>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                )}
            )}
            <ImagePreviewModal
                open={previewOpen}
                onClose={handlePreviewClose}
                imageUrl={previewImageUrl}
            />
        </Grid>
    );
}
import { React, useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Divider,
    CardActions,
    Button,
    CardMedia,
    Box,
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
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "flex-start",
            }}
        >
            {dataList.map((product) => {
                const imageUrl = `${host}/uploads/${product.image}`;
                return (
                    <Card
                        key={product._id}
                        sx={{
                            width: 280,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <CardMedia
                            sx={{ height: 140 }}
                            image={imageUrl}
                            title={product.name}
                            onClick={() => handlePreviewOpen(imageUrl)}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Price: ₱{product.price}
                            </Typography>
                        </CardContent>
                        <Divider />
                        <CardActions style={{ justifyContent: "center" }}>
                            <Button
                                size="small"
                                onClick={() => handleRemove(product)}
                            >
                                <Remove />
                            </Button>
                            <Typography variant="body2" color="text.secondary">
                                Quantity: {product.quantity || 0}
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => handleAdd(product)}
                            >
                                <Add />
                            </Button>
                        </CardActions>
                    </Card>
                );
            })}
            <ImagePreviewModal
                open={previewOpen}
                onClose={handlePreviewClose}
                imageUrl={previewImageUrl}
            />
        </Box>
    );
}

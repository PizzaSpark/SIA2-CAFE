import React from "react";
import {
    Card,
    CardActions,
    CardContent,
    Typography,
    CardMedia,
    IconButton,
    Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ProjectsContainer({
    dataList,
    host,
    userRole,
    onEdit,
    onDelete,
}) {
    const navigate = useNavigate();

    const handleCardClick = (link) => {
        if (link) {
            window.open(link, "_blank");
        }
    };

    return (
        <Grid container spacing={2}>
            {dataList.map((item) => {
                const imageUrl = `${host}/uploads/${item.image}`;
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                        <Card
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                cursor: item.link ? "pointer" : "default",
                            }}
                            onClick={() => handleCardClick(item.link)}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={imageUrl}
                                alt={item.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="div">
                                    {item.name}
                                </Typography>
                            </CardContent>
                            {userRole && userRole !== "Customer" && (
                                <CardActions>
                                    <IconButton
                                        aria-label="edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(item);
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item._id);
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            )}
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}

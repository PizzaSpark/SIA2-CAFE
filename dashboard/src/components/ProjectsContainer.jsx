import React from "react";
import {
    Card,
    CardActions,
    CardContent,
    Typography,
    CardMedia,
    IconButton,
    Grid,
    Box,
    Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function ProjectsContainer({ dataList, host, userRole, onEdit, onDelete }) {
    const handleCardClick = (link) => {
        if (link) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Box 
            sx={{ 
                height: 'calc(100vh - 200px)', // Adjust this value based on your layout
                overflowY: 'auto',
                padding: 2,
                '&::-webkit-scrollbar': {
                    width: '0.4em'
                },
                '&::-webkit-scrollbar-track': {
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.1)',
                    outline: '1px solid slategrey'
                }
            }}
        >
            <Grid container spacing={3}>
                {dataList.map((item) => {
                    const imageUrl = `${host}/uploads/${item.image}`;
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                            <Card 
                                sx={{ 
                                    display: "flex", 
                                    flexDirection: "column", 
                                    height: "100%",
                                    transition: "0.3s",
                                    cursor: item.link ? "pointer" : "default",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
                                    },
                                }}
                                onClick={() => handleCardClick(item.link)}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={imageUrl}
                                    alt={item.name}
                                    sx={{
                                        objectFit: "cover",
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {item.name}
                                    </Typography>
                                    {item.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {item.description.length > 100
                                                ? `${item.description.substring(0, 100)}...`
                                                : item.description}
                                        </Typography>
                                    )}
                                    {item.technologies && (
                                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {item.technologies.split(',').map((tech, index) => (
                                                <Chip key={index} label={tech.trim()} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                </CardContent>
                                {userRole && userRole !== 'Customer' && (
                                    <CardActions sx={{ justifyContent: "flex-start", px: 2, py: 1 }}>
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
        </Box>
    );
}
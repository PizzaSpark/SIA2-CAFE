const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); //
const path = require("path"); //
const fs = require('fs');

// Server configuration
const port = 1337;
const host = "0.0.0.0";
const dbName = "siacafe-database";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/uploads', express.static(uploadsDir)); // to access uploads folder in api

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const stockRoutes = require('./routes/stocks');
app.use('/api/stocks', stockRoutes);

const menuItemRoutes = require('./routes/menuItems');
app.use('/api/menuItems', menuItemRoutes);

const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

// MongoDB connection
mongoose
    .connect(`mongodb://localhost:27017/${dbName}`)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));

app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
});

// Default route
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

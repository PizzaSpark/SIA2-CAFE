const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
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
app.use('/uploads', express.static(uploadsDir));

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const stockRoutes = require('./routes/stocks');
app.use('/api/stocks', stockRoutes);

const menuItemRoutes = require('./routes/menuItems');
app.use('/api/menuItems', menuItemRoutes);

const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);

const auditRoutes = require('./routes/audits');
app.use('/api/audits', auditRoutes);

const receiptRoutes = require('./routes/receipts');
app.use('/api/receipts', receiptRoutes);

const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);

// Function to check if database is empty
async function isDatabaseEmpty() {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.length === 0;
}

// MongoDB connection
mongoose
    .connect(`mongodb://localhost:27017/${dbName}`)
    .then(async () => {
        console.log("Database connected successfully");
        const empty = await isDatabaseEmpty();
        if (empty) {
            console.log("Database is empty. Please restore your data using MongoDB Compass.");
        } else {
            console.log("Database is not empty. Proceeding with normal operation.");
        }
    })
    .catch((err) => console.error("Database connection error", err));

app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
});

// Default route
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

// Import models and routers
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products'); // Corrected to use products router

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/users", usersRouter);
app.use("/products", productsRouter); // Corrected to use products router

// Static files directory for uploads
const uploadsDir = path.join(__dirname, "/uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// Server configuration
const port = 1337;
const dbName = "siacafe-database";
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Default route
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// MongoDB connection
mongoose
    .connect("mongodb://localhost:27017/" + dbName)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});
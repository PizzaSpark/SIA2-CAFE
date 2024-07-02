const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path"); //
const cors = require("cors"); //

// Server configuration
const port = 1337;
const host = "0.0.0.0";
const dbName = "siacafe-database";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

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

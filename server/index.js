const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

const { User, Product } = require("./models");

app.use(cors());
app.use(bodyParser.json());

// Stating the path of the uploads directory
const uploadsDir = path.join(__dirname, "/uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

const port = 1337;
const dbName = "film-database";

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

//MARK: MongoDB
mongoose
    .connect("mongodb://localhost:27017/" + dbName)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

// Error handling middleware
const handleError = (err, res) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
};

// Function to delete image
const deleteImage = (imagePath) => {
    fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting old image:", err);
    });
};

//add
app.post("/products", upload.single("picture"), async (req, res) => {
    const incomingData = req.body;
    incomingData.picture = req.file.filename;

    try {
        const dataObject = new Product(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data added successfully!" });
    } catch (error) {
        console.error("Error adding data:", error);
        handleError(error, res);
    }
});

//view
app.get("/products", async (req, res) => {
    try {
        const gotDataList = await Product.find();
        res.json(gotDataList);
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});

//edit
app.put("/products/:id", upload.single("picture"), async (req, res) => {
    const incomingData = req.body;
    if (req.file) {
        incomingData.picture = req.file.filename;
    }

    try {
        const dataObject = await Product.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        // Delete the old image only if a new one has been uploaded
        if (
            req.file &&
            dataObject.picture && 
            typeof dataObject.picture === "string" 
        ) {
            try {
                const imagePath = path.join(uploadsDir, dataObject.picture);
                deleteImage(imagePath);
            } catch (urlError) {
                console.error("Error parsing old image URL:", urlError);
            }
        }

        // Update the document and save it
        Object.assign(dataObject, incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data updated successfully!" });
    } catch (error) {
        handleError(error, res);
    }
});

//delete
app.delete("/products/:id", async (req, res) => {
    try {
        const dataObject = await DataModel.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        // Delete the image if it exists
        if (dataObject.picture && typeof dataObject.picture === "string") {
            const imagePath = path.join(uploadsDir, dataObject.picture);
            console.log("Deleting image at path:", imagePath);
            deleteImage(imagePath);
        } else {
            console.error("No valid image path found for deletion");
        }

        try {
            await DataModel.deleteOne({ _id: dataObject._id });
        } catch (error) {
            console.error("Error deleting data:", error);
            return res.json({ message: "Error deleting data" });
        }

        res.json({ success: true, message: "Data deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        handleError(error, res);
    }
});

//add
app.post("/users", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = new User(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "User added successfully!" });
    } catch (error) {
        console.error("Error adding User:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//view
app.get("/users", async (req, res) => {
    try {
        const gotDataList = await User.find();
        res.json(gotDataList);
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});

//edit
app.put("/users/:id", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await User.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        Object.assign(dataObject, incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data updated successfully!" });
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});

//delete
app.delete("/users/:id", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await User.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        try {
            await User.deleteOne({ _id: dataObject._id });
        } catch (error) {
            console.error("Error deleting data:", error);
            return res.json({ message: "Error deleting data" });
        }

        res.json({ success: true, message: "Data deleted successfully!" });
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});
const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const path = require('path');
const { fileOps } = require('../utils');

const uploadsDir = fileOps.uploadsDir;

//add
router.post("/products", upload.single("picture"), async (req, res) => {
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
router.get("/products", async (req, res) => {
    try {
        const gotDataList = await Product.find();
        res.json(gotDataList);
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});

//edit
router.put("/products/:id", upload.single("picture"), async (req, res) => {
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
                fileOps.deleteImage(imagePath);
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
router.delete("/products/:id", async (req, res) => {
    try {
        const dataObject = await DataModel.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        // Delete the image if it exists
        if (dataObject.picture && typeof dataObject.picture === "string") {
            const imagePath = path.join(uploadsDir, dataObject.picture);
            console.log("Deleting image at path:", imagePath);
            fileOps.deleteImage(imagePath);
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

module.exports = router;


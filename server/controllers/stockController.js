const dataModel = require("../models/Stock");
const mongoose = require("mongoose");

exports.createStock = async (req, res) => {
    try {
        const dataObject = new dataModel(req.body);
        const savedData = await dataObject.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create multiple stock items
exports.createStocks = async (req, res) => {
    try {
        const bulkOps = req.body.map(item => ({
            updateOne: {
                filter: { name: item.name },  // Assuming 'name' is the unique identifier
                update: {
                    $inc: { quantity: item.quantity },  // Add the new quantity to the existing one
                    $set: {  // Set other fields
                        description: item.description,
                        price: item.price,
                        // Add other fields as needed, but exclude 'quantity'
                    }
                },
                upsert: true
            }
        }));

        const result = await dataModel.bulkWrite(bulkOps);
        
        res.status(200).json({
            success: true,
            message: "Stocks created or updated successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount
        });
    } catch (error) {
        console.error("Error in createStocks:", error);
        res.status(400).json({
            success: false,
            message: "Failed to create or update stocks",
            error: error.message
        });
    }
};

exports.getStocks = async (req, res) => {
    try {
        const dataObject = await dataModel.find();
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single stock
exports.getStock = async (req, res) => {
    try {
        const dataObject = await dataModel.findById(req.params.id);
        if (!dataObject) return res.status(404).json({ message: "Data not found" });
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const updatedObject = await dataModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedObject)
            return res.status(404).json({ message: "Data not found" });
        res.json(updatedObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteStock = async (req, res) => {
    try {
        const deletedObject = await dataModel.findByIdAndDelete(req.params.id);
        if (!deletedObject)
            return res.status(404).json({ message: "Data not found" });
        res.json({ message: "Data deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


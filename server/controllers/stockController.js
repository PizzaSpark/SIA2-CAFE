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
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const dataObjects = await dataModel.insertMany(req.body, { session });
        await session.commitTransaction();
        res.status(201).json(dataObjects);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
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


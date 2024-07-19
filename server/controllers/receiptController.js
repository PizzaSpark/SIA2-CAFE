const dataModel = require("../models/Receipt");

exports.createReceipt = async (req, res) => {
    try {
        const dataObject = new dataModel(req.body);
        const savedData = await dataObject.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getReceipts = async (req, res) => {
    try {
        const dataObject = await dataModel.find();
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single item
exports.getReceipt = async (req, res) => {
    try {
        const dataObject = await dataModel.findById(req.params.id);
        if (!dataObject) return res.status(404).json({ message: "Data not found" });
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateReceipt = async (req, res) => {
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

exports.deleteReceipt = async (req, res) => {
    try {
        const deletedObject = await dataModel.findByIdAndDelete(req.params.id);
        if (!deletedObject)
            return res.status(404).json({ message: "Data not found" });
        res.json({ message: "Data deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


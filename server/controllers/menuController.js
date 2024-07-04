const dataModel = require("../models/MenuItem");
const { deleteImage } = require("../middlewares/imageDelete");

exports.createMenuItem = async (req, res) => {
    try {
        const dataObject = new dataModel({
            ...req.body,
            image: req.file ? req.file.filename : null,
        });

        await dataObject.save();

        res.status(201).json(dataObject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllMenuItems = async (req, res) => {
    try {
        const dataObject = await dataModel.find();
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single menu
exports.getMenu = async (req, res) => {
    try {
        const dataObject = await dataModel.findById(req.params.id);
        if (!dataObject)
            return res.status(404).json({ message: "Data not found" });
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const updateFields = { ...req.body };
        const dataObject = await dataModel.findById(req.params.id);

        if (!dataObject) {
            return res.status(404).json({ error: "Data not found" });
        }

        if (req.file) {
            if (dataObject.image) {
                try {
                    await deleteImage(dataObject.image);
                } catch (err) {
                    console.error("Error deleting old image:", err);
                }
            }
            updateFields.image = req.file.filename;
        }

        Object.assign(dataObject, updateFields);

        const updatedDataObject = await dataObject.save();
        res.status(200).json(updatedDataObject);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const dataObject = await dataModel.findById(req.params.id);

        if (!dataObject) {
            return res.status(404).json({ error: "Data not found" });
        }

        if (dataObject.image) {
            try {
                await deleteImage(dataObject.image);
            } catch (err) {
                console.error("Error deleting image:", err);
            }
        }

        await dataObject.remove();
        res.status(200).json({ message: "Data deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

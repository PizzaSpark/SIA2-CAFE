const dataModel = require("../models/Project");
const { deleteImage } = require("../middlewares/imageDelete");

exports.addProject = async (req, res) => {
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

exports.getAllProjects = async (req, res) => {
    try {
        const dataObject = await dataModel.aggregate([
            {
                $addFields: {
                    lowerCaseName: { $toLower: "$name" }
                }
            },
            {
                $sort: { lowerCaseName: 1 }
            },
            {
                $project: {
                    lowerCaseName: 0 // Optionally remove the temporary field from the output
                }
            }
        ]);
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllActiveProjects = async (req, res) => {
    try {
        const excludeName = req.params.name;
        const dataObject = await dataModel.aggregate([
            {
                $match: { 
                    isActive: true,
                    name: { $ne: excludeName } // Exclude the item with the name from req.params.name
                }
            },
            {
                $addFields: {
                    lowerCaseName: { $toLower: "$name" }
                }
            },
            {
                $sort: { lowerCaseName: 1 }
            },
            {
                $project: {
                    lowerCaseName: 0 // Remove the temporary field from the output
                }
            }
        ]);
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single item
exports.getProject = async (req, res) => {
    try {
        const dataObject = await dataModel.findById(req.params.id);
        if (!dataObject)
            return res.status(404).json({ message: "Data not found" });
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
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

exports.deleteProject = async (req, res) => {
    try {
        const dataObject = await dataModel.findByIdAndDelete(req.params.id);

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

        res.status(200).json({ message: "Data deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

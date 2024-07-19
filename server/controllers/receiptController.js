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

exports.getSalesStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Top 5 sellers (items)
        const topSellers = await dataModel.aggregate([
            { $unwind: "$items" },
            { 
                $group: { 
                    _id: "$items.name", 
                    totalQuantity: { $sum: "$items.quantity" },
                    totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
                } 
            },
            { $sort: { totalSales: -1 } },
            { $limit: 5 }
        ]);

        // Receipt count and total income for today
        const todayStats = await dataModel.aggregate([
            { $match: { createdAt: { $gte: today } } },
            { 
                $group: { 
                    _id: null, 
                    count: { $sum: 1 }, 
                    totalIncome: { $sum: "$total" } 
                } 
            }
        ]);

        // Receipt count and total income for the week
        const weekStats = await dataModel.aggregate([
            { $match: { createdAt: { $gte: weekAgo } } },
            { 
                $group: { 
                    _id: null, 
                    count: { $sum: 1 }, 
                    totalIncome: { $sum: "$total" } 
                } 
            }
        ]);

        res.json({
            topSellers,
            today: todayStats[0] || { count: 0, totalIncome: 0 },
            week: weekStats[0] || { count: 0, totalIncome: 0 }
        });
    } catch (error) {
        console.error("Error in getSalesStats:", error);
        res.status(500).json({ message: "Error fetching sales stats", error: error.message });
    }
};
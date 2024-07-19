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

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const totalSales = await dataModel.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$total" }, count: { $sum: 1 } } }
        ]);

        const dailySales = await dataModel.aggregate([
            { $match: { createdAt: { $gte: today } } },
            { $group: { _id: null, dailyAmount: { $sum: "$total" }, dailyCount: { $sum: 1 } } }
        ]);

        const weeklySales = await dataModel.aggregate([
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $group: { _id: null, weeklyAmount: { $sum: "$total" }, weeklyCount: { $sum: 1 } } }
        ]);

        res.json({
            totalAmount: totalSales[0]?.totalAmount || 0,
            totalCount: totalSales[0]?.count || 0,
            dailyAmount: dailySales[0]?.dailyAmount || 0,
            dailyCount: dailySales[0]?.dailyCount || 0,
            weeklyAmount: weeklySales[0]?.weeklyAmount || 0,
            weeklyCount: weeklySales[0]?.weeklyCount || 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTopSellers = async (req, res) => {
    try {
        const topSellers = await dataModel.aggregate([
            { $unwind: "$items" },
            { $group: { name: "$items.name", totalSold: { $sum: "$items.quantity" }, totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        res.json(topSellers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


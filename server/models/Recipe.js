const mongoose = require("mongoose");

const collectionName = "recipes";
const requiredNumber = { type: Number, default: 0 };
const referencedMenuItem = { type: mongoose.Schema.Types.ObjectId, ref: 'menuitems', required: true };
const referencedStockItem = { type: mongoose.Schema.Types.ObjectId, ref: 'stocks', required: true };

const DataModel = new mongoose.Schema({
    menuItem: referencedMenuItem,
    stock: referencedStockItem,
    quantity: requiredNumber,
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model(collectionName, DataModel);

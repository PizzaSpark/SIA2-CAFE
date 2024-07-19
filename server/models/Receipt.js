const mongoose = require("mongoose");

const collectionName = "receipts";
const requiredString = { type: String, required: true };
const requiredNumber = { type: Number, required: true };
const forItems = [
    {
        name: String,
        quantity: Number,
        price: Number,
    },
];

const DataModel = new mongoose.Schema(
    {
        total: requiredNumber,
        items: forItems,
        buyer: requiredString,
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model(collectionName, DataModel);

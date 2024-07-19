const mongoose = require("mongoose");

const collectionName = "transactions";
const requiredUniqueString = { type: String, required: true, unique: true };
const requiredString = { type: String, required: true, default: "test" };
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

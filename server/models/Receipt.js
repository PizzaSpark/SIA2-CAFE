const mongoose = require("mongoose");

const collectionName = "receipts";
const requiredNumber = { type: Number, required: true };
const referencedUser = { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true };
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
        buyer: referencedUser,
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model(collectionName, DataModel);

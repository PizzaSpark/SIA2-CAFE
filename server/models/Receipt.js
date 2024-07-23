const mongoose = require("mongoose");

const collectionName = "receipts";
const requiredNumber = { type: Number, required: true };
const referencedUser = { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true };
const itemsBought = [
    {
        name: String,
        quantity: Number,
        price: Number,
    },
];
const bankInformation = [
    {
        name: String,
        referenceId: String,
    },
];

const DataModel = new mongoose.Schema(
    {
        bank: bankInformation,
        total: requiredNumber,
        items: itemsBought,
        buyer: referencedUser,
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model(collectionName, DataModel);

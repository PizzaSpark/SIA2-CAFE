const mongoose = require("mongoose");

const collectionName = "stocks";
const requiredUniqueString = { type: String, required: true, unique: true };
const requiredNumber = { type: Number, default: 0 };

const DataModel = new mongoose.Schema({
    name: requiredUniqueString,
    quantity: requiredNumber,
    minimum: requiredNumber,
});

module.exports = mongoose.model(collectionName, DataModel);

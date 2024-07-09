const mongoose = require("mongoose");

const collectionName = "menuitems";
const requiredUniqueString = { type: String, required: true, unique: true };
const requiredString = { type: String, required: true };
const requiredBoolean = { type: Boolean, default: true };
const requiredNumber = { type: Number, default: 0 };

const DataModel = new mongoose.Schema({
    name: requiredUniqueString,
    price: requiredNumber,
    image: requiredString,
    isActive: requiredBoolean,
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model(collectionName, DataModel);

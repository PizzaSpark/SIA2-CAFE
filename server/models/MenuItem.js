const mongoose = require("mongoose");

const collectionName = "menus";
const requiredUniqueString = { type: String, required: true, unique: true };
const requiredString = { type: String, required: true };
const requiredBoolean = { type: Boolean, default: false };
const requiredNumber = { type: Number, default: 0 };

const DataModel = new mongoose.Schema({
    name: requiredUniqueString,
    price: requiredNumber,
    image: requiredString,
    disabled: requiredBoolean,
});

module.exports = mongoose.model(collectionName, DataModel);

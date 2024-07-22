const mongoose = require("mongoose");

const collectionName = "projectlist";
const requiredString = { type: String, required: true };
const requiredBoolean = { type: Boolean, required: true };

const DataModel = new mongoose.Schema({
    name: requiredString,
    image: requiredString,
    link: requiredString,
    isActive: requiredBoolean
}, { versionKey: false });

module.exports = mongoose.model(collectionName, DataModel);

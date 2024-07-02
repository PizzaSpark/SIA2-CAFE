const mongoose = require("mongoose");

const collectionName = "users";
const requiredUniqueString = { type: String, required: true, unique: true };
const requiredString = { type: String, required: true };
const defaultRole = { type: String, required: true, default: 'customer'};
const requiredBoolean = { type: Boolean, required: true, default: false };

const requiredNumber = { type: Number, required: true };

const DataModel = new mongoose.Schema({
    email: requiredUniqueString,
    password: requiredString,
    name: requiredString,
    role: defaultRole,
    disabled: requiredBoolean,
});

module.exports = mongoose.model(collectionName, DataModel);

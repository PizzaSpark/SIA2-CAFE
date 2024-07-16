const mongoose = require("mongoose");

const collectionName = "users";
const requiredUniqueString = { type: String, required: true, unique: true };
const requiredString = { type: String, required: true, default: 'test' };
const defaultRole = { type: String, required: true, default: 'customer'};
const requiredBoolean = { type: Boolean, required: true, default: true };

const DataModel = new mongoose.Schema({
    email: requiredUniqueString,
    password: requiredString,
    name: requiredString,
    role: defaultRole,
    isActive: requiredBoolean,
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model(collectionName, DataModel);

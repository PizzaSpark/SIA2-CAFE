const mongoose = require("mongoose");

const collectionName = "audit";
const requiredString = { type: String, required: true };
const referencedUser = { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true };

const DataModel = new mongoose.Schema({
    action: requiredString,
    user: referencedUser,
    details: requiredString,
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model(collectionName, DataModel);

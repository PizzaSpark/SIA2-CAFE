const mongoose = require("mongoose");
const { Schema, model: _model } = mongoose;

const collectionName = "users";
const requiredUniqueString = { type: String, required: true, unique: true };
const requiredString = { type: String, required: true };
const requiredNumber = { type: Number, required: true };
const requiredBoolean = { type: Boolean, required: true };

const DataModel = new Schema(
    {
        email: requiredUniqueString,
        password: requiredString,
        name: requiredString,
        type: requiredString,
        disabled: requiredBoolean,
    },
    { collection: collectionName }
);

const model = _model(collectionName, DataModel);

module.exports = model;

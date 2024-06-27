const mongoose = require("mongoose");
const { Schema, model: _model } = mongoose;

const collectionName = "products";
const requiredString = { type: String, required: true };
const requiredNumber = { type: Number, required: true };
const requiredBoolean = { type: Boolean, required: true };

const DataModel = new Schema(
    {
        picture: requiredString,
        name: requiredString,
        price: requiredNumber,
        disabled: requiredBoolean,
    },
    { collection: collectionName }
);

const model = _model(collectionName, DataModel);

module.exports = model;

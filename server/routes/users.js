const express = require('express');
const router = express.Router();
const { User } = require('../models');


//add
router.post("/users", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = new User(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "User added successfully!" });
    } catch (error) {
        console.error("Error adding User:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//view
router.get("/users", async (req, res) => {
    try {
        const gotDataList = await User.find();
        res.json(gotDataList);
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});

//edit
router.put("/users/:id", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await User.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        Object.assign(dataObject, incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data updated successfully!" });
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});

//delete
router.delete("/users/:id", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await User.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        try {
            await User.deleteOne({ _id: dataObject._id });
        } catch (error) {
            console.error("Error deleting data:", error);
            return res.json({ message: "Error deleting data" });
        }

        res.json({ success: true, message: "Data deleted successfully!" });
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});

module.exports = router;
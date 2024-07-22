const dataModel = require("../models/User");
const bcrypt = require('bcryptjs');
const saltRounds = 10; // You can adjust the salt rounds as needed

exports.createUser = async (req, res) => {
    try {

        // Check if the email already exists
        const existingUser = await dataModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create a new user with the hashed password
        const dataObject = new dataModel({
            ...req.body,
            password: hashedPassword,
        });

        const savedData = await dataObject.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const dataObject = await dataModel.find();
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single user
exports.getUser = async (req, res) => {
    try {
        const dataObject = await dataModel.findById(req.params.id);
        if (!dataObject) return res.status(404).json({ message: "Data not found" });
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Retrieve the current user data
        const currentUser = await dataModel.findById(req.params.id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the email has been changed and if it's already in use
        if (req.body.email && req.body.email !== currentUser.email) {
            const emailExists = await dataModel.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ message: "Email is already in use" });
            }
        }

        const updatedObject = await dataModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedObject)
            return res.status(404).json({ message: "Data not found" });
        res.json(updatedObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedObject = await dataModel.findByIdAndDelete(req.params.id);
        if (!deletedObject)
            return res.status(404).json({ message: "Data not found" });
        res.json({ message: "Data deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        // Find the user by email
        const dataObject = await dataModel.findOne({ email: req.body.email });
        if (!dataObject) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is disabled
        if (!dataObject.isActive) {
            return res.status(403).json({ message: "User is disabled" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(req.body.password, dataObject.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Respond with user data (omit sensitive information)
        // Here you might also generate a token or session
        const { password, createdAt, updatedAt, ...dataObjectWithoutPassword } = dataObject.toObject();
        res.json(dataObjectWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password: requestBodyPassword } = req.body;

        // Check if user already exists
        const existingUser = await dataModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(requestBodyPassword, saltRounds);

        // Create new user
        const newUser = new dataModel({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Remove password from the response
        const { password: savedUserPassword, createdAt, updatedAt, ...userWithoutPassword } = savedUser.toObject();

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        // Find the user
        const user = await dataModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


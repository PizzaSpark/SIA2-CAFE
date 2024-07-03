const User = require("../models/User");

exports.createUser = async (req, res) => {
    try {
        const dataObject = new User(req.body);
        const savedData = await dataObject.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const dataObject = await User.find();
        res.json(dataObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Data not found" });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedObject = await User.findByIdAndUpdate(
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
        const deletedObject = await User.findByIdAndDelete(req.params.id);
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
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the stored hashed password
        // const isMatch = await bcrypt.compare(req.body.password, user.password);

        const isMatch = req.body.password == user.password;

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Respond with user data (omit sensitive information)
        // Here you might also generate a token or session
        const { password, ...userDataWithoutPassword } = user.toObject();
        res.json(userDataWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


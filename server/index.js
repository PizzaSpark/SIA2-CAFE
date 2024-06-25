// index.js or app.js

const express = require("express");
const sequelize = require("./config"); // path to your sequelize configuration
const User = require("./models/User"); // path to your Sequelize model(s)

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await User.create({ username, email, password });
        res.json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update the user's attributes
        user.username = username;
        user.email = email;
        user.password = password;

        await user.save();

        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Error updating user" });
    }
});

app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user" });
    }
});

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

// run this maybe ask gpt
// npx sequelize-cli migration:create --name create-tbl-users
// npx sequelize-cli db:migrate

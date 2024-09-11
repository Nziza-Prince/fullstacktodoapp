const bcrypt = require("bcrypt")
const {Router} = require("express")
const router = Router()
const User = require("../models/usermodel")
const jwt = require("jsonwebtoken")
const secret = "TopSecret"

// Backend code (Node.js)
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: user._id, userEmail: user.email },
            secret,
            { expiresIn: "24h" }
        );

        res.status(200).send({ message: "Logged in successfully", token: token });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


module.exports = router
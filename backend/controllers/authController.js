const User = require('../model/user');



const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // TODOS: Hash the password before saving to DB
        // TODOS: Implment JWT tokens for authentication and authorization
        // TODOS: OTP send & verification
        // TODOS: welcome mail to the user 
        const user = await User.create({ name, email, password, role });
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { registerUser }

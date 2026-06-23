const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // TODOS: Hash the password before saving to DB
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        // TODOS: Implment JWT tokens for authentication and authorization
        // TODOS: OTP send & verification
        // TODOS: welcome mail to the user 
        const user = await User.create({ name, email, hashedPassword, role });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `Hello ${name} Welcome to KhareedoNow! Your OTP for registration is ${otp} and it will expire in 10 minutes`;
            // SEND THE OTP TO THE USER
            await sendEmail(email, 'Verify your email to join KhareedoNow', message);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.verified,
                token: generateToken(user._id)
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Get All Users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        console.log(error);
        res.json({ message: "Internal server error" });
    }
};

module.exports = { registerUser, loginUser, getUsers }

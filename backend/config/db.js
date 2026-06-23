const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI).then(
            () => console.log("Database connected")
        )
    } catch (error) {
        console.error("Error connecting to database", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

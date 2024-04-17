const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017")
        console.log("Connection to database successful.")
    } catch (error) {
        console.log("Connection to database fail.")
        process.exit(1)
    }
}

module.exports = connectDB;
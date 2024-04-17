const express = require("express");
const connectDB = require("./db");

const app = express();

// Body parser for express app
app.use(express.json())

app.use("/api/user", require("./routes/user.route"));
app.use("/api/video", require("./routes/video.route"));

connectDB();

app.listen(8080, () => {
    console.log("Server is running on port 8080.")
})
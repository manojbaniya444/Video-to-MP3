const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const app = express();

// Body parser for express app
app.use(express.json());

// cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user", require("./routes/user.route"));
app.use("/api/video", require("./routes/video.route"));

connectDB();

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});

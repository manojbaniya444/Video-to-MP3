const bcrypt = require("bcrypt");
const User = require("../model/user.schema");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // check if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide username and password both.",
    });
  }

  // check if the user exists
  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    return res.status(400).json({
      message: "User does not exist. Please register first.",
    });
  }

  // check if the password is correct
  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid password." });
  }

  // generate jwt token
  const token = jwt.sign(
    { username: existingUser.username, id: existingUser._id },
    "ssshhh",
    {
      expiresIn: "3d",
    }
  );

  // set the cookies
  res.setHeader("Set-Cookie", `token=${token}; Path=/;`);

  // set the user in the request object
  req.user = existingUser;

  return res
    .status(200)
    .json({ message: "User logged in successfully.", token: token });
  // generate token and further actions here.
};

const logoutUser = async (req, res) => {
  res.setHeader(
    "Set-Cookie",
    `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`
  );
  return res.status(200).json({ message: "User logged out successfully." });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide username and password both.",
    });
  }

  // check if the user exists
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({
      message: "Username already exists. Please try with different username.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).send("User registered successfully.");
  } catch (error) {
    return res.status(500).send("Failed to register user.");
  }
};

const checkAuth = async (req, res) => {
  if (!req.headers.cookie) {
    return res.status(401).json({ auth: false, message: "No headers cookie" });
  }

  const token = req.headers.cookie.split("=")[1];

  if (!token) {
    return res.status(401).json({ auth: false, message: "No token" });
  }

  const decoded = await jwt.verify(token, "ssshhh");
  if (!decoded) {
    return res.status(401).json({ auth: false, message: "Invalid token" });
  }

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  return res.status(200).json({ auth: true, message: "auth" });
};

module.exports = {
  loginUser,
  registerUser,
  checkAuth,
  logoutUser,
};

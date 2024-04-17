const bcrypt = require("bcrypt");
const User = require("../model/user.schema");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // check if the username and password are provided
  if (!username || !password) {
    return res.status(400).send("Please provide username and password.");
  }

  // check if the user exists
  const existingUser = await User.findOne({ username });

  if (!existingUser) {
    return res.status(400).send("User with username does not exists.");
  }

  // check if the password is correct
  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) {
    return res.status(400).send("Invalid password.");
  }

  // generate jwt token
  const token = jwt.sign(
    { username: existingUser.usernamem, id: existingUser._id },
    "ssshhh",
    {
      expiresIn: "3d",
    }
  );

  // set the cookies
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  // set the user in the request object
  req.user = existingUser;

  return res
    .status(200)
    .json({ message: "User logged in successfully.", token: token });
  // generate token and further actions here.
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please provide username and password.");
  }

  // check if the user exists
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).send("User already exists.");
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

module.exports = {
  loginUser,
  registerUser,
};

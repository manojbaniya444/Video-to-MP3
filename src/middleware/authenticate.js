const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.cookie.split("=")[1];

  if (!token) {
    return res.status(401).send("Unauthorized access.");
  }
  const decoded = jwt.verify(token, "ssshhh");

  req.user = decoded;

  next();
};

module.exports = { authenticate };

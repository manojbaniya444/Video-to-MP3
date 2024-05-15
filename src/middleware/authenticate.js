const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  if (!req.headers.cookie) {
    
    return res.status(401).json({
      message: "Unauthorized access.",
    });
  }
  const token = req.headers.cookie.split("=")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access.",
    });
  }
  const decoded = jwt.verify(token, "ssshhh");

  req.user = decoded;

  next();
};

module.exports = { authenticate };

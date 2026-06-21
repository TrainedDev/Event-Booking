const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config();

const authVerify = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorizeRoles = () => {
  return (req, res, next) => {
    if (req.user.role !== "event_organizer") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { authVerify, authorizeRoles };
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    console.error("❌ No token provided!");
    return res.status(401).json({ message: "Access Denied: No Token" });
  }

  try {
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      console.error("❌ Invalid token format!");
      return res.status(400).json({ message: "Invalid Token Format" });
    }

    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = decoded;

    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (err) {
    console.error("❌ Invalid Token:", err.message);
    return res.status(403).json({ message: "Invalid Token" });
  }
};

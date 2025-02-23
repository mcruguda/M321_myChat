const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRETKEY || `SUPERSECRET_KEY`;

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    const id = decoded.data.userId;
    const username = decoded.data.username;
    const birthday = decoded.data.userBirth;
    req.body.userId = id;
    req.body.username = username;
    next();
  });
}

module.exports = { verifyToken };

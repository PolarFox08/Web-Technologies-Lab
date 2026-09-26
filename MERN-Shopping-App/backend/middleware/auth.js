const jwt = require('jsonwebtoken');

// Auth middleware: Verify JWT token from Authorization header and attach user payload
module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  // Check if header is present
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Expect Bearer <token> format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = parts[1];

  try {
    // Verify JWT with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    // Invalid or expired token
    return res.status(401).json({ error: 'Token is not valid' });
  }
};
